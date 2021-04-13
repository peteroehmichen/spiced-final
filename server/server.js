if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const server = require("http").Server(app);
const db = require("./db");

const activeSockets = {};
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith("https://the-sharp-end.app")
        ),
});

const compression = require("compression");
const path = require("path");

const cookieSession = require("cookie-session");
const csurf = require("csurf");

const cookieSessionMiddleware = cookieSession({
    secret: process.env.cookie_secret,
    maxAge: 1000 * 60 * 60 * 24 * 7,
});

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

const { grades, experience, location_topics } = require("./config.json");
const { getCountries } = require("./countryAPI");
const { activeUsers } = require("./socketHelper");
const { analyseMatches } = require("./analyseMatches");
// let visibleOnlineUsers = [];

//////////////////////////////////////////////////////
const loggedOutRoutes = require("./loggedOutRoutes");
app.use(loggedOutRoutes);
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
const profileTripsRoutes = require("./profileTripsRoutes");
app.use(profileTripsRoutes);
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
const locationRoutes = require("./locationRoutes");
app.use(locationRoutes);
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
const socialRoutes = require("./socialRoutes");
app.use(socialRoutes);
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
const matchRoutes = require("./matchRoutes");
app.use(matchRoutes);
//////////////////////////////////////////////////////

app.get("/in/essentialData.json", async (req, res) => {
    try {
        const countries = await getCountries();
        // console.log(countries);
        // const { Response: countries } = JSON.parse(result.body);
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
                location_topics,
                user: results.user.rows[0],
                locations: results.locations.rows,
                trips: results.trips.rows,
                matches: analyseMatches(results.matches.rows),
                friendships: results.friendships.rows,
            };
            // FIXME proper ugly solution
            for (let i = 0; i < obj.matches.length; i++) {
                for (let j = 0; j < obj.locations.length; j++) {
                    if (obj.matches[i].location_id == obj.locations[j].id) {
                        obj.matches[i].location_name = obj.locations[j].name;
                        break;
                    }
                }
            }
            res.json({ success: obj, error: false });
        } else {
            console.log("error in creating essential-obj:", results);
            res.json({
                success: false,
                error: {
                    type: "major",
                    text: "Could not load all essential data",
                },
            });
        }
    } catch (error) {
        console.log("Error in DB on creating essential-obj:", error);
        res.json({
            success: false,
            error: {
                type: "major",
                text: "Could not access all essential databases",
            },
        });
    }
});

app.get("/redirect", (req, res) => {
    console.log("OAUTH for GIT was hit");
    res.sendStatus(200);
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

server.listen(process.env.PORT, function () {
    console.log("The Sharp End is running...");
});

io.on("connection", async (socket) => {
    activeSockets[socket.id] = socket.request.session.userId;
    const users = await activeUsers(activeSockets);
    io.emit("activeUsers", users);

    socket.on("markAsRead", async (messages) => {
        try {
            await db.markReadMessages(messages.arr);
            let recipientSocket = Object.entries(activeSockets);
            for (let i = 0; i < recipientSocket.length; i++) {
                if (recipientSocket[i][1] == messages.idOfSender) {
                    io.to(recipientSocket[i][0]).emit(
                        "ownMessagesRead",
                        messages.arr
                    );
                }
            }
        } catch (error) {
            console.log("Error while marking as read:", error);
        }
    });

    socket.on("newMessageToServer", async (msg) => {
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
                    msg.topic,
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
                    // TODO mail if unavailable
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
    });

    socket.on("disconnect", async () => {
        delete activeSockets[socket.id];
        io.emit("activeUsers", await activeUsers(activeSockets));
    });
});
