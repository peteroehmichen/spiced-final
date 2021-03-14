const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith(
                    "http://the-sharp-end.herokuapp.com"
                )
        ),
});

const compression = require("compression");
const path = require("path");

let cookie_secret = process.env.cookie_secret
    ? process.env.cookie_secret
    : require("../secrets.json").secretOfSession;
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: cookie_secret,
    maxAge: 1000 * 60 * 60 * 24 * 7,
});

const csurf = require("csurf");

const db = require("./db");
const aws = require("./aws");
const activeSockets = {};
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use((req, res, next) => {
    res.cookie("myCookieSecret", req.csrfToken());
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const { grades, experience } = require("./config.json");
const { getCountries } = require("./countryAPI");
const { activeUsers } = require("./socketHelper");
const { analyseMatches } = require("./analyseMatches");

//////////////////////////////////////////////////////
const router = require("./loggedOutRoutes");
app.use(router);
//////////////////////////////////////////////////////

app.get("/in/essentialData.json", async (req, res) => {
    try {
        let result = await getCountries();
        const { Response: countries } = JSON.parse(result.body);
        const continents = [];
        let countriesPure = countries.map((country) => {
            if (!continents.includes(country.Region) && country.Region != "") {
                continents.push(country.Region);
            }
            return {
                Name: country.Name,
                Region: country.Region,
            };
        });
        const results = await db.getEssentialData(req.session.userId);
        if (results.user.rowCount > 0) {
            const obj = {
                countries: countriesPure,
                continents,
                grades,
                experience,
                user: results.user.rows[0],
                locations: results.locations.rows,
                trips: results.trips.rows,
                matches: analyseMatches(results.matches.rows),
            };

            res.json({ success: obj, error: false });
        } else {
            console.log("error in essential-obj:", results);
            res.json({
                success: false,
                error: {
                    type: "essential",
                    text: "couldn't load necessary data",
                },
            });
        }
    } catch (error) {
        console.log("Error in DB on fetching essentials:", error);
        res.json({
            success: false,
            error: {
                type: "essential",
                text: "couldn't load necessary data",
            },
        });
    }
});
// app.get("/in/essentialData.json", async (req, res) => {
//     let result = await getCountries();
//     const { Response: countries } = JSON.parse(result.body);
//     const continents = [];
//     countries.forEach((country) => {
//         if (!continents.includes(country.Region) && country.Region != "") {
//             continents.push(country.Region);
//         }
//     });
//     // console.log("continents:", continents);
//     try {
//         const results = await db.getEssentialData(req.session.userId);
//         // results.tripsRaw.rowCount > 0
//         // console.log(results.userRaw);
//         // console.log(results.locationsRaw);
//         if (results.userRaw.rowCount > 0) {
//             const obj = {
//                 user: results.userRaw.rows[0],
//                 locations: results.locationsRaw.rows,
//                 countries,
//                 continents,
//                 grades,
//                 experience,
//                 // trips: results.tripsRaw[0],
//             };
//             obj.user.id = req.session.userId;
//             res.json({ success: obj, error: false });
//         } else {
//             console.log("error in Obj:", results);
//             res.json({ success: false, error: "couldn't load necessary data" });
//         }
//     } catch (error) {
//         console.log("Error in DB:", error);
//         res.json({ success: false, error: "couldn't access database" });
//     }
// });

app.get("/in/userData.json", async (req, res) => {
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

app.post("/in/updateUserData.json", async (req, res) => {
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
                error: { type: "notifications", text: "formatting Error" },
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

app.post("/in/updateTripData.json", async (req, res) => {
    const tripId = req.body.id;
    delete req.body.id;
    // console.log("tripID", tripId);
    // console.log("body:", req.body);
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
                error: { type: "notifications", text: "formatting Error" },
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

app.get("/in/deleteTrip.json", async (req, res) => {
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
                    text: "unable to delete from DB",
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

app.post("/in/addLocationSection.json", async (req, res) => {
    try {
        const result = await db.addLocationSection(
            req.body.title,
            req.body.content,
            req.body.id,
            req.body.prev
        );
        // console.log("before", result.rows[0]);
        // console.log("after", JSON.parse(result.rows[0].infos));
        if (result.rowCount > 0) {
            return res.json({ success: result.rows[0], error: false });
        } else {
            res.json({ success: false, error: "Formatting Error" });
        }
    } catch (err) {
        console.log("Error in trip-Update:", err);
        res.json({ success: false, error: "Failed Connection to Database" });
    }
});

app.get("/in/addLocation.json", async (req, res) => {
    // console.log("receiving:", req.query);
    const { continent, country, name } = req.query;
    try {
        const result = await db.addLocation(continent, country, name);
        // console.log("checking:", result);
        if (result.rowCount > 0) {
            req.query.id = result.rows[0].id;
            return res.json({
                success: req.query,
                error: false,
            });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notification",
                    text: "Error in writing to DB",
                },
            });
        }
    } catch (err) {
        console.log("checking Error:", err);
        res.json({
            success: false,
            error: {
                type: "notification",
                text: "Failed Connection to Database",
            },
        });
    }
});

app.get("/in/getLocations.json", async (req, res) => {
    // console.log("fetching locations");
    try {
        const result = await db.getLocations();
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
                error: "DB rejected command",
            });
        }
    } catch (error) {
        console.log("DB-Error:", error);
        res.json({
            success: false,
            error: "Failed Connection to DB",
        });
    }
});

app.get("/in/locationData.json", async (req, res) => {
    try {
        const result = await db.getLocationById(req.query.id);
        if (result.rowCount > 0) {
            const ratings = await db.getLocationRating(
                req.query.id,
                req.session.userId
            );
            let locationData = {
                ...result.rows[0],
                ...ratings.rating.rows[0],
                own: ratings.user.rows[0]?.own || false,
            };
            return res.json({ success: locationData, error: false });
        } else {
            res.json({
                success: false,
                error: { type: "notification", text: "Location unkown" },
            });
        }
    } catch (err) {
        console.log("checking2:", err);
        res.json({
            success: false,
            error: {
                type: "notification",
                text: "Failed Connection to Database",
            },
        });
    }
});

app.get("/in/changeLocationRating.json", async (req, res) => {
    console.log("rating query", req.query);
    try {
        await db.changeLocationRating(
            req.query.value,
            req.query.id,
            req.session.userId
        );
        const results = await db.getLocationRating(
            req.query.id,
            req.session.userId
        );
        let rating = results.rating.rows[0];
        rating.location_id = req.query.id;
        rating.own = results.user.rows.length
            ? results.user.rows[0].own
            : false;
        //  results.user.rows[0]?.own || false;
        console.log("rating:", rating);
        res.json({ success: rating, error: false });
    } catch (error) {
        console.log("Error in updating rating:", error);
        res.json({
            success: false,
            error: {
                type: "notification",
                text: "Failed Connection to Database",
            },
        });
    }
});

app.get("/in/getTrips.json", async (req, res) => {
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
                error: "DB rejected command",
            });
        }
    } catch (error) {
        console.log("DB-Error:", error);
        res.json({
            success: false,
            error: "Failed Connection to DB",
        });
    }
});

app.post("/in/addTrip.json", async (req, res) => {
    // console.log("receiving:", req.body);
    const { location_id, from_min, until_max, comment } = req.body;
    try {
        const result = await db.addTrip(
            location_id,
            from_min,
            until_max,
            comment,
            req.session.userId
        );
        // console.log("checking:", result);
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
                error: "Error in writing to DB",
            });
        }
    } catch (err) {
        console.log("checking Error:", err);
        res.json({
            success: false,
            error: "Failed Connection to Database",
        });
    }
    // res.json({ success: "OK - trip" });
});

app.get("/api/friends.json", async (req, res) => {
    // console.log("fetching friends for user:", req.session.userId);
    try {
        const { rows } = await db.getFriendships(req.session.userId);
        res.json({ success: rows, error: false });
    } catch (error) {
        console.log("error in fetching friends:", error);
        res.json({
            success: false,
            error: {
                type: "notification",
                text: "Failed Connection to Database",
            },
        });
    }
});

app.post("/api/user/friendBtn.json", async (req, res) => {
    // console.log();
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
                    text: "Internal error - please try again later",
                },
            });
        }
    } catch (error) {
        console.log("Error in FriendBtn-Server:", error);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Server error - please try again later",
            },
        });
    }
});

app.get("/api/findUsers.json", async (req, res) => {
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

app.post("/api/user/friendBtn.json", async (req, res) => {
    // console.log();
    try {
        if (req.body.task == "") {
            const { rows } = await db.getFriendInfo(
                req.session.userId,
                req.body.friendId
            );
            // console.log("DB-Results", rows);
            if (rows.length == 0) {
                return res.json({ text: "Send Friend Request" });
            }
            if (rows[0].confirmed) {
                return res.json({ text: "Cancel Friendship" });
            }
            if (rows[0].sender == req.session.userId) {
                return res.json({ text: "Cancel Request" });
            }
            return res.json({ text: "Accept Request" });
        }

        if (req.body.task == "Send Friend Request") {
            const { rowCount } = await db.safeFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Cancel Request" });
            }
        }

        if (req.body.task == "Cancel Request") {
            const { rowCount } = await db.deleteFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Send Friend Request" });
            }
        }

        if (req.body.task == "Accept Request") {
            const { rowCount } = await db.confirmFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Cancel Friendship" });
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
            // console.log("DB from Cancel", rowCount);
            if (rowCount > 0) {
                return res.json({ text: "Send Friend Request" });
            }
        }

        return res.json({
            text: "Internal error - please try again later",
            error: true,
        });
    } catch (error) {
        return res.json({
            text: "Server error - please try again later",
            error: true,
        });
    }
});

app.get("/in/matches.json", async (req, res) => {
    // console.log("server looking for matches...");
    try {
        const { rows: matches } = await db.getMatches(req.session.userId);
        const filteredMatches = matches.filter(
            (trip) =>
                trip.until_max >= trip.match_from_min &&
                trip.match_until_max >= trip.from_min
        );

        const formattedMatches = filteredMatches.map((trip) => {
            trip.match_duration =
                1 +
                (trip.match_until_max - trip.match_from_min) /
                    (1000 * 60 * 60 * 24);

            if (trip.match_from_min < trip.from_min) {
                // I arrive earlier
                if (trip.match_until_max < trip.until_max) {
                    // "I leave earlier"
                    // my max - their arrival
                    trip.match_overlap = trip.match_until_max - trip.from_min;
                } else if (trip.match_until_max == trip.until_max) {
                    // "I leave the same day"
                    // my max - their arrival
                    trip.match_overlap = trip.match_until_max - trip.from_min;
                } else {
                    // their max - their arrival
                    trip.match_overlap = trip.until_max - trip.from_min;
                }
            } else if (trip.match_from_min == trip.from_min) {
                // "I arrive the same day"
                if (trip.match_until_max < trip.until_max) {
                    // "I leave earlier"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else if (trip.match_until_max == trip.until_max) {
                    // "I leave the same day"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else {
                    // their max - their min
                    trip.match_overlap = trip.until_max - trip.from_min;
                }
            } else {
                // I arrive later
                if (trip.match_until_max < trip.until_max) {
                    // "I leave earlier"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else if (trip.match_until_max == trip.until_max) {
                    // "I leave the same day"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else {
                    // their max - my min
                    trip.match_overlap = trip.until_max - trip.match_from_min;
                }
            }
            trip.match_overlap = 1 + trip.match_overlap / (1000 * 60 * 60 * 24);
            trip.match_overlap_percent = Math.floor(
                (trip.match_overlap * 100) / trip.match_duration
            );
            return trip;
        });
        res.json({ success: formattedMatches, error: false });
    } catch (error) {
        console.log("error:", error);
        res.json({
            success: false,
            error: "Could not fetch matches from Server",
        });
    }
});

app.get("/in/chat.json", async (req, res) => {
    // userId = req.session.userId;

    // console.log("requested chat", req.query);
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

    // res.json([{ success: "test" }]);
    // id = req.session.userId;
});

// app.get("/in/getLocationRating.json", async (req, res) => {
//     // console.log("fetching rating for location", req.query.q);
//     try {
//         const results = await db.getLocationRating(
//             req.query.q,
//             req.session.userId
//         );
//         let rating = results.rating.rows[0];
//         rating.location = req.query.q;
//         if (results.user.rows.length) {
//             rating.your_rating = results.user.rows[0].rate;
//             rating.your_rating_date = results.user.rows[0].created_at;
//         }
//         res.json({ success: rating, error: false });
//     } catch (error) {
//         console.log("Error during fetching rating:", error);
//         res.json({ success: false, error: "Server Error" });
//     }
// });

app.post("/in/picture.json", aws.uploader.single("file"), async (req, res) => {
    try {
        const awsAdd = await aws.uploadToAWS(req);
        let sql;
        if (awsAdd.url) {
            const awsDelete = await aws.deleteFromAWS(req.body.old);
            if (!awsDelete.success) {
                console.log("could not delete image", req.body.old);
            }
            if (req.body.location_id) {
                sql = await db.addLocationPic(awsAdd.url, req.body.location_id);
            } else if (req.body.trip_id) {
                sql = await db.addTripPic(awsAdd.url, req.body.trip_id);
            } else {
                sql = await db.addProfilePic(awsAdd.url, req.session.userId);
            }
        }
        if (sql.rowCount > 0) {
            res.json({ success: awsAdd, error: false });
        } else {
            res.json({ success: false, error: "DB rejected new picture" });
        }
    } catch (error) {
        res.json({ success: false, error: "Server denied upload" });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    activeSockets[socket.id] = socket.request.session.userId;
    // console.log("userid:", userId);
    // console.log("userid from Socket", socket.request.session.userId);

    socket.on("newMessageToServer", async (msg) => {
        // console.log("Friend-Chat:", msg);
        let status;
        try {
            let result;
            if (msg.type == "friend") {
                result = await db.addFriendMessage(
                    socket.request.session.userId,
                    msg.recipient,
                    msg.value
                );
            } else if (msg.type == "trip") {
                result = await db.addTripMessage(
                    socket.request.session.userId,
                    msg.recipient,
                    msg.trip_origin,
                    msg.trip_target,
                    msg.value
                );
            } else if (msg.type == "location") {
                result = await db.addLocationMessage(
                    socket.request.session.userId,
                    msg.location,
                    msg.value
                );
            }
            status = {
                success: {
                    ...result.user.rows[0],
                    ...result.chat.rows[0],
                },
                error: false,
            };
        } catch (error) {
            status = {
                success: false,
                error: { type: "notifications", text: "Server Error" },
            };
        }
        if (msg.type == "location") {
            io.emit("newMessageToClient", status);
        } else {
            let recipientSocket = Object.entries(activeSockets);
            for (let i = 0; i < recipientSocket.length; i++) {
                if (recipientSocket[i][1] == msg.recipient) {
                    // FIXME mail if unavailable
                    io.to(recipientSocket[i][0]).emit(
                        "newMessageToClient",
                        status
                    );
                }
            }
            if (status.sender == socket.request.session.userId) {
                status.from_me = true;
            }
            socket.emit("newMessageToClient", status);
        }

        // if (msg.type == "friend") {
        //     let recipientSocket = Object.entries(activeSockets);
        //     for (let i = 0; i < recipientSocket.length; i++) {
        //         if (recipientSocket[i][1] == msg.recipient) {
        //             // FIXME mail if unavailable
        //             io.to(recipientSocket[i][0]).emit("newMsg", status);
        //         }
        //     }
        //     if (status.sender == socket.request.session.userId) {
        //         status.from_me = true;
        //     }
        //     socket.emit("newMsg", status);
        // } else if (msg.type == "trip") {
        //     let recipientSocket = Object.entries(activeSockets);
        //     for (let i = 0; i < recipientSocket.length; i++) {
        //         if (recipientSocket[i][1] == msg.recipient) {
        //             // FIXME mail if unavailable
        //             io.to(recipientSocket[i][0]).emit("newMsg", status);
        //         }
        //     }
        //     if (status.sender == socket.request.session.userId) {
        //         status.from_me = true;
        //     }
        //     socket.emit("newMsg", status);
        // } else if (msg.type == "location") {
        //     io.emit("newMsg", status);
        // }
    });
    // socket.on("newFriendMessage", async (msg) => {
    //     // console.log("Friend-Chat:", msg);
    //     let status;
    //     try {
    //         const result = await db.addFriendMessage(
    //             socket.request.session.userId,
    //             msg.recipient,
    //             msg.value
    //         );
    //         status = {
    //             success: {
    //                 ...result.user.rows[0],
    //                 ...result.chat.rows[0],
    //             },
    //             error: false,
    //         };
    //     } catch (error) {
    //         status = {
    //             success: false,
    //             error: { type: "notifications", text: "Server Error" },
    //         };
    //     }
    //     let recipientSocket = Object.entries(activeSockets);
    //     for (let i = 0; i < recipientSocket.length; i++) {
    //         if (recipientSocket[i][1] == msg.recipient) {
    //             // FIXME mail if unavailable
    //             io.to(recipientSocket[i][0]).emit("newMsg", status);
    //         }
    //     }
    //     if (status.sender == socket.request.session.userId) {
    //         status.from_me = true;
    //     }
    //     socket.emit("newMsg", status);
    // });

    // socket.on("newTripMessage", async (msg) => {
    //     // console.log("received Trip-Chat:", msg);
    //     let status;
    //     try {
    //         const result = await db.addTripMessage(
    //             socket.request.session.userId,
    //             msg.recipient,
    //             msg.trip_origin,
    //             msg.trip_target,
    //             msg.value
    //         );

    //         status = {
    //             ...result.user.rows[0],
    //             ...result.chat.rows[0],
    //         };
    //         // console.log("status:", status);
    //         // console.log("result:", result);
    //     } catch (error) {
    //         console.log("Problem:", error);
    //         status = { error: "Server Error" };
    //     }
    //     let recipientSocket = Object.entries(activeSockets);
    //     for (let i = 0; i < recipientSocket.length; i++) {
    //         if (recipientSocket[i][1] == msg.recipient) {
    //             // FIXME mail if unavailable
    //             io.to(recipientSocket[i][0]).emit("newMsg", status);
    //         }
    //     }
    //     if (status.sender == socket.request.session.userId) {
    //         status.from_me = true;
    //     }
    //     socket.emit("newMsg", status);
    // });
    // socket.on("newLocationMessage", async (msg) => {
    //     // console.log("received Location-Chat:", msg);
    //     let status;
    //     try {
    //         const result = await db.addLocationMessage(
    //             socket.request.session.userId,
    //             msg.location,
    //             msg.value
    //         );

    //         status = {
    //             success: {
    //                 ...result.user.rows[0],
    //                 ...result.chat.rows[0],
    //             },
    //             error: false,
    //         };
    //         if (status.sender == socket.request.session.userId) {
    //             status.from_me = true;
    //         }
    //         // console.log("status:", status);
    //         // console.log("result:", result);
    //     } catch (error) {
    //         console.log("Problem:", error);
    //         status = {
    //             success: false,
    //             error: {
    //                 type: "notifications",
    //                 text: "Server Error in adding chat-message",
    //             },
    //         };
    //     }
    //     io.emit("newMsg", status);
    // });

    // if (msg.recipient == 0) {
    //     // message to all
    //     status.public = true;
    //     status.private = false;
    //     io.emit("newMsg", status);
    // } else if (msg.recipient == id) {
    //     // message to self
    //     status.public = false;
    //     status.private = true;
    //     socket.emit("newMsg", status);
    // } else {
    // }
    socket.on("disconnect", async () => {
        delete activeSockets[socket.id];
        io.emit("activeUsers", await activeUsers(activeSockets));

        // console.log("disconnecting socket:", socket.id);
    });
});

// app.get("/in/getOtherTrips.json", async (req, res) => {
//     // console.log("fetching trips");
//     try {
//         const result = await db.getTripsbyUser(req.body.q);
//         // console.log("from DB:", result.rows);
//         if (result.rows) {
//             res.json({
//                 success: result.rows,
//                 error: false,
//             });
//         } else {
//             console.log("DB-Rejection:", result);
//             res.json({
//                 success: false,
//                 error: "DB rejected command",
//             });
//         }
//     } catch (error) {
//         console.log("DB-Error:", error);
//         res.json({
//             success: false,
//             error: "Failed Connection to DB",
//         });
//     }
// });
