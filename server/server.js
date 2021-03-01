const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
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
const auth = require("./auth");
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

const {
    CODE_VALIDITY_IN_MINUTES,
    grades,
    experience,
} = require("./config.json");
const { getCountries } = require("./countryAPI");
const { match } = require("assert");
const { activeUsers } = require("./socketHelper");

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/welcome/register.json", async (req, res) => {
    const { first, last, email, password } = req.body;
    if (first == "" || last == "" || !email.includes("@") || password == "") {
        return res.json({
            error: "Prohibited input",
        });
    }
    try {
        const hashedPw = await auth.hash(password);
        const result = await db.addUser(first, last, email, hashedPw);
        req.session.userId = result.rows[0].id;
        res.json({ status: "OK" });
    } catch (err) {
        if (err.code == "23505") {
            res.json({ error: "E-Mail already exists" });
        } else {
            res.json({ error: "Server error" });
        }
    }
});

app.post("/welcome/login.json", async (req, res) => {
    try {
        const result = await db.getAuthenticatedUser(
            req.body.email,
            req.body.password
        );
        if (result.id) {
            req.session.userId = result.id;
            res.json({
                status: "OK",
            });
        } else {
            console.log("Login-Error:", result);
            if (result.error == "Error in DB") {
                res.json({ error: "No Connection" });
            } else {
                res.json({ error: "Invalid user credentials" });
            }
        }
    } catch (err) {
        res.json({ error: "Log in rejected" });
    }
});

app.post("/welcome/reset.json", async (req, res) => {
    try {
        const user = await db.getUserByEmail(req.body.email);
        if (user.rowCount > 0) {
            const code = await aws.sendEMail(req.body.email);
            const result = await db.addResetCode(req.body.email, code);
            if (result.rowCount > 0) {
                const start = new Date(result.rows[0].created_at);
                const end = new Date(
                    start.getTime() + CODE_VALIDITY_IN_MINUTES * 60000
                ).valueOf();
                res.json({ codeValidUntil: end });
            } else {
                res.json({
                    error: "Couldn't read DB",
                });
            }
        } else {
            res.json({ error: "User not found" });
        }
    } catch (err) {
        res.json({ error: "Unknown error in DB" });
    }
});

app.post("/welcome/code.json", async (req, res) => {
    try {
        const isCodeValid = await db.confirmCode(
            req.body.code,
            CODE_VALIDITY_IN_MINUTES.toString(),
            req.body.email
        );
        if (isCodeValid) {
            const hashedPw = await auth.hash(req.body.password);
            const result = await db.updateUserPw(req.body.email, hashedPw);
            if (result.rowCount > 0) {
                res.json({ update: "ok" });
            } else {
                res.json({ error: "Error in password-reset" });
            }
        } else {
            res.json({ error: "Invalid code" });
        }
    } catch (err) {
        res.json({ error: "Unknown error" });
    }
});

app.get("/in/essentialData.json", async (req, res) => {
    let result = await getCountries();
    const { Response: countries } = JSON.parse(result.body);
    const continents = [];
    countries.forEach((country) => {
        if (!continents.includes(country.Region) && country.Region != "") {
            continents.push(country.Region);
        }
    });
    // console.log("continents:", continents);
    try {
        const results = await db.getEssentialData(req.session.userId);
        // results.tripsRaw.rowCount > 0
        if (results.userRaw.rowCount > 0 && results.locationsRaw.rowCount > 0) {
            const obj = {
                user: results.userRaw.rows[0],
                locations: results.locationsRaw.rows,
                countries,
                continents,
                grades,
                experience,
            };
            // FIXME change userDataSQL and select all fields manually so that the id wont be overwritten by the friendshipstatus
            obj.user.id = req.session.userId;
            res.json({ success: obj, error: false });
        } else {
            console.log("error in Obj:", results);
            res.json({ success: false, error: "couldn't load necessary data" });
        }
    } catch (error) {
        console.log("Error in DB:", error);
        res.json({ success: false, error: "couldn't access database" });
    }
});

app.get("/in/userData.json", async (req, res) => {
    // console.log("receiving:", req.query);
    if (req.query.id == req.session.userId) {
        return res.json({ error: "Cannot display YOU" });
    }
    const idForDb = req.query.id == 0 ? req.session.userId : req.query.id;
    try {
        const results = await db.getUserById(idForDb, req.session.userId);
        // console.log("checking:", results);
        if (results.rowCount > 0) {
            results.rows[0].id = idForDb;
            delete results.rows[0].password;
            delete results.rows[0].sender;
            delete results.rows[0].recipient;
            return res.json({ ...results.rows[0] });
        } else {
            res.json({ error: "User unkown - please log in again" });
        }
    } catch (err) {
        console.log("checking2:", err);
        res.json({ error: "Failed Connection to Database" });
    }
});

app.post("/in/updateUserData.json", async (req, res) => {
    // console.log("updating: ", req.body);
    const {
        age,
        location,
        grade_comfort,
        grade_max,
        experience,
        description,
    } = req.body;
    const result = await db.updateUserData(
        age,
        location,
        grade_comfort,
        grade_max,
        description,
        experience,
        req.session.userId
    );
    res.json(result);
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
    // console.log("receiving:", req.query);
    // const idForDb = req.query.id == 0 ? req.session.userId : req.query.id;
    try {
        const results = await db.getLocationById(req.query.id);
        // console.log("checking:", results);
        if (results.rowCount > 0) {
            return res.json({ success: results.rows[0] });
        } else {
            res.json({ error: "Location unkown" });
        }
    } catch (err) {
        // console.log("checking2:", err);
        res.json({ error: "Failed Connection to Database" });
    }
});

app.get("/in/getTrips.json", async (req, res) => {
    // console.log("fetching trips");
    try {
        const result = await db.getTripsbyUser(req.session.userId);
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
        res.json(rows);
    } catch (error) {
        console.log("error in fetching friends:", error);
        res.json({ error: "Error in Loading Friends" });
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
        const { rows: matches } = await db.getLocationMatches(
            req.session.userId
        );
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
    // console.log("requested chat", req.query);
    const { about, id } = req.query;
    try {
        const { rows } = await db.getLastChats(about, id, req.session.userId);
        // console.log("sending back Chats:", rows.length);
        res.json(rows.reverse());
    } catch (error) {
        console.log("error in loading chat:", error);
        res.json({ error: "Error in Loading Chat" });
    }

    // res.json([{ success: "test" }]);
    // id = req.session.userId;
});

app.get("/in/getLocationRating.json", async (req, res) => {
    // console.log("fetching rating for location", req.query.q);
    try {
        const results = await db.getLocationRating(
            req.query.q,
            req.session.userId
        );
        let rating = results.rating.rows[0];
        rating.location = req.query.q;
        if (results.user.rows.length) {
            rating.your_rating = results.user.rows[0].rate;
            rating.your_rating_date = results.user.rows[0].created_at;
        }
        res.json({ success: rating, error: false });
    } catch (error) {
        console.log("Error during fetching rating:", error);
        res.json({ success: false, error: "Server Error" });
    }
});

app.get("/in/changeLocationRating.json", async (req, res) => {
    // console.log(req.query);
    try {
        const result = await db.changeLocationRating(
            req.query.value,
            req.query.id,
            req.session.userId
        );
        const results = await db.getLocationRating(
            req.query.id,
            req.session.userId
        );
        let rating = results.rating.rows[0];
        rating.location = req.query.q;
        if (results.user.rows.length) {
            rating.your_rating = results.user.rows[0].rate;
            rating.your_rating_date = results.user.rows[0].created_at;
        }
        res.json({ success: rating, error: false });
    } catch (error) {
        console.log("Error in updating rating:", error);
        res.json({ success: false, error: "Server Error" });
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

    socket.on("newFriendMessage", async (msg) => {
        // console.log("Friend-Chat:", msg);
        let status;
        try {
            const result = await db.addFriendMessage(
                socket.request.session.userId,
                msg.recipient,
                msg.value
            );
            status = {
                ...result.user.rows[0],
                ...result.chat.rows[0],
            };
        } catch (error) {
            status = { error: "Server Error" };
        }
        socket.emit("newFriendMsg", status);
        let recipientSocket = Object.entries(activeSockets);
        for (let i = 0; i < recipientSocket.length; i++) {
            if (recipientSocket[i][1] == msg.recipient) {
                // FIXME mail if unavailable
                io.to(recipientSocket[i][0]).emit("newFriendMsg", status);
            }
        }
    });
    socket.on("newTripMessage", async (msg) => {
        // console.log("received Trip-Chat:", msg);
        let status;
        try {
            const result = await db.addTripMessage(
                socket.request.session.userId,
                msg.recipient,
                msg.trip_origin,
                msg.trip_target,
                msg.value
            );

            status = {
                ...result.user.rows[0],
                ...result.chat.rows[0],
            };
            // console.log("status:", status);
            // console.log("result:", result);
        } catch (error) {
            console.log("Problem:", error);
            status = { error: "Server Error" };
        }
        socket.emit("newTripMsg", status);
        let recipientSocket = Object.entries(activeSockets);
        for (let i = 0; i < recipientSocket.length; i++) {
            if (recipientSocket[i][1] == msg.recipient) {
                // FIXME mail if unavailable
                io.to(recipientSocket[i][0]).emit("newTripMsg", status);
            }
        }
    });
    socket.on("newLocationMessage", async (msg) => {
        // console.log("received Location-Chat:", msg);
        let status;
        try {
            const result = await db.addLocationMessage(
                socket.request.session.userId,
                msg.location,
                msg.value
            );

            status = {
                ...result.user.rows[0],
                ...result.chat.rows[0],
            };
            // console.log("status:", status);
            // console.log("result:", result);
        } catch (error) {
            console.log("Problem:", error);
            status = { error: "Server Error" };
        }
        io.emit("newLocationMsg", status);
    });

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
