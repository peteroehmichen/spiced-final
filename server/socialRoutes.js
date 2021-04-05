const express = require("express");
const router = express.Router();
const db = require("./db");
const aws = require("./aws");

router.get("/api/friends.json", async (req, res) => {
    // console.log("fetching friends for user:", req.session.userId);
    try {
        const { rows } = await db.getFriendships(req.session.userId);
        res.json({ success: rows, error: false });
    } catch (error) {
        console.log("error in fetching friends:", error);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Failed Connection to Database",
            },
        });
    }
});

router.post("/api/user/friendBtn.json", async (req, res) => {
    let text;
    try {
        if (req.body.task == "") {
            const { rows } = await db.getFriendInfo(
                req.session.userId,
                req.body.friendId
            );
            if (rows.length == 0) {
                text = "Send Friend Request";
            } else if (rows[0].confirmed) {
                text = "Cancel Friendship";
            } else if (rows[0].sender == req.session.userId) {
                text = "Cancel Request";
            } else {
                text = "Accept Request";
            }
        }

        if (req.body.task == "Send Friend Request") {
            const { rowCount } = await db.safeFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                text = "Cancel Request";
            }
        }

        if (req.body.task == "Cancel Request") {
            const { rowCount } = await db.deleteFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                text = "Send Friend Request";
            }
        }

        if (req.body.task == "Accept Request") {
            const { rowCount } = await db.confirmFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                text = "Cancel Friendship";
            }
        }

        if (
            req.body.task == "Cancel Friendship" ||
            req.body.task == "Deny Request"
        ) {
            const { rowCount } = await db.deleteFriendship(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                text = "Send Friend Request";
            }
        }
        if (text) {
            return res.json({
                success: { text },
                error: false,
            });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notifications",
                    text: "unknown database error",
                },
            });
        }
    } catch (error) {
        console.log("Error in FriendBtn-Server:", error);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Could not connect to database",
            },
        });
    }
});

router.get("/api/findUsers.json", async (req, res) => {
    // console.log("answering with:", req.query);
    const { search } = req.query;
    try {
        const result = await db.getUserByTextSearch(search, req.session.userId);
        // console.log(result.first.rows);
        // console.log(result.last.rows);
        result.rows = [...result.first.rows, ...result.last.rows];
        result.rowCount = result.first.rowCount + result.last.rowCount;

        if (result.rowCount > 0) {
            res.json({
                search,
                result: result.rows,
            });
        } else {
            res.json({ empty: "no users found" });
        }
    } catch (err) {
        console.log(err);
        res.json({ error: "Problem in connecting to Database" });
    }
});

router.get("/in/chat.json", async (req, res) => {
    const { about, id, limit } = req.query;
    try {
        const { rows } = await db.getLastChats(
            about,
            id,
            req.session.userId,
            limit
        );
        // console.log("sending back Chats:", rows.length);
        for (let i = 0; i < rows.length; i++) {
            // console.log("message:", rows[i].sender, req.session.userId);
            if (rows[i].sender == req.session.userId) {
                rows[i].from_me = true;
            }
        }
        res.json({ success: rows.reverse(), error: false });
    } catch (error) {
        console.log("error in loading chat:", error);
        res.json({
            success: false,
            error: { type: "notifications", text: "Error in Loading Chat" },
        });
    }
});

router.post(
    "/in/picture.json",
    aws.uploader.single("file"),
    async (req, res) => {
        try {
            const awsAdd = await aws.uploadToAWS(req);
            let sql;
            if (awsAdd.url) {
                const awsDelete = await aws.deleteFromAWS(req.body.old);
                if (!awsDelete.success) {
                    console.log("could not delete image", req.body.old);
                }
                if (req.body.location_id) {
                    sql = await db.addLocationPic(
                        awsAdd.url,
                        req.body.location_id
                    );
                } else if (req.body.trip_id) {
                    sql = await db.addTripPic(awsAdd.url, req.body.trip_id);
                } else {
                    sql = await db.addProfilePic(
                        awsAdd.url,
                        req.session.userId
                    );
                }
            }
            if (sql.rowCount > 0) {
                res.json({ success: awsAdd, error: false });
            } else {
                res.json({
                    success: false,
                    error: {
                        type: "notifications",
                        text: "Database could not add the picture",
                    },
                });
            }
        } catch (error) {
            res.json({
                success: false,
                error: { type: "notifications", text: "Server denied upload" },
            });
        }
    }
);

module.exports = router;
