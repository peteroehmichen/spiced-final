const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/in/userData.json", async (req, res) => {
    if (req.query.id == req.session.userId) {
        return res.json({
            success: false,
            error: { type: "essential", text: "Cannot display YOU" },
        });
    }
    try {
        const results = await db.getUserById(req.query.id, req.session.userId);
        if (results.rowCount > 0) {
            return res.json({
                success: {
                    ...results.rows[0],
                },
                error: false,
            });
        } else {
            res.json({
                success: false,
                error: {
                    type: "essential",
                    text: "User unkown",
                },
            });
        }
    } catch (err) {
        console.log("checking2:", err);
        res.json({
            success: false,
            error: {
                type: "essential",
                text: "Error in Connecting to DB",
            },
        });
    }
});

router.post("/in/updateUserData.json", async (req, res) => {
    try {
        for (let element in req.body) {
            await db.updateUserData(
                element,
                req.body[element],
                req.session.userId
            );
        }
        const results = await db.getProfileData(req.session.userId);
        if (results.rowCount > 0) {
            return res.json({ success: results.rows[0], error: false });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notifications",
                    text: "Database rejected new user infos",
                },
            });
        }
    } catch (err) {
        console.log("Error in user-Update:", err);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Failed Connection to Database",
            },
        });
    }
});

router.post("/in/updateTripData.json", async (req, res) => {
    const tripId = req.body.id;
    delete req.body.id;
    try {
        for (let element in req.body) {
            await db.updateTripData(element, req.body[element], tripId);
        }
        const results = await db.getTripById(tripId);
        if (results.rowCount > 0) {
            return res.json({ success: results.rows[0], error: false });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notifications",
                    text: "Database rejected new trip details",
                },
            });
        }
    } catch (err) {
        console.log("Error in trip-Update:", err);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Failed Connection to Database",
            },
        });
    }
});

router.get("/in/deleteTrip.json", async (req, res) => {
    try {
        // FIXME delete AWS picture as well
        const result = await db.deleteTripById(req.query.id);
        if (result.rowCount > 0) {
            return res.json({ success: { id: req.query.id }, error: false });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notifications",
                    text: "Unable to delete from Database",
                },
            });
        }
    } catch (err) {
        console.log("Error in trip-Delete:", err);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Failed Connection to Database",
            },
        });
    }
});

router.get("/in/getTrips.json", async (req, res) => {
    // console.log("fetching trips");
    try {
        const result = await db.getOwnAndFriendsFutureTrips(req.session.userId);
        // console.log("from DB:", result.rows);
        if (result.rows) {
            res.json({
                success: result.rows,
                error: false,
            });
        } else {
            console.log("DB-Rejection:", result);
            res.json({
                success: false,
                error: { type: "notifications", text: "DB rejected command" },
            });
        }
    } catch (error) {
        console.log("DB-Error:", error);
        res.json({
            success: false,
            error: { type: "notifications", text: "Failed Connection to DB" },
        });
    }
});

router.post("/in/addTrip.json", async (req, res) => {
    const { location_id, from_min, until_max, comment } = req.body;
    try {
        const result = await db.addTrip(
            location_id,
            from_min,
            until_max,
            comment,
            req.session.userId
        );
        if (result.rowCount > 0) {
            req.body.person = req.session.userId;
            req.body.id = result.rows[0].id;
            return res.json({
                success: req.body,
                error: false,
            });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notifications",
                    text: "Database rejected the data",
                },
            });
        }
    } catch (err) {
        console.log("checking Error:", err);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Failed Connection to Database",
            },
        });
    }
});

module.exports = router;
