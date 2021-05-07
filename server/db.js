/*
// this is my mongoDB-exercise
const uri = process.env.mongoDbUser
    ? `mongodb+srv://${process.env.mongoDbUser}:${process.env.mongoDbPassword}@cluster0.3mjmo.mongodb.net/?retryWrites=true&w=majority`
    : "mongodb://localhost:27017/?readPreference=primary&appname=mongodb-vscode%200.5.0&ssl=false";
const { MongoClient } = require("mongodb");
const mClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function testMongo() {
    // FIXME Topology is closed error on reload
    try {
        await mClient.connect();
        console.log("Connected to MongoDB-Server");

        const databasesList = await mClient.db().admin().listDatabases();
        console.log("Databases:", databasesList);

        
        // write and read a test object to a specific collection
        const mongo = mClient.db("the-sharp-end");
        const collection = mongo.collection("people");
        await collection.insertOne({first: "Peter", last: "Oehmichen"});
        const myDoc = await collection.findOne();
        console.log(myDoc);
        
    } catch (err) {
        console.log(err.stack);
    } finally {
        await mClient.close();
        console.log("Disconnected from MongoDB-Server");
    }
}

*/
const auth = require("./auth");
const spicedPg = require("spiced-pg");
const sql = spicedPg(process.env.DATABASE_URL);

const redis = require("redis");
const client = redis.createClient(
    process.env.REDIS_URL || { host: "localhost", port: 6379 }
);
const { promisify } = require("util");
const { analyseMatches } = require("./analyseMatches");
client.on("error", function (err) {
    console.log(err);
});
exports.rdsGet = promisify(client.get).bind(client);
exports.rdsSetex = promisify(client.setex).bind(client);
exports.rdsDel = promisify(client.del).bind(client);

module.exports.addUser = function (username, email, hashedPW) {
    return sql.query(
        `INSERT INTO USERS (username, email, password, login_type) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [username, email, hashedPW, "local"]
    );
};

module.exports.addLocation = function (continent, country, name) {
    // console.log("DB query with:", continent, country, name);
    return sql.query(
        `INSERT INTO locations (continent, country, name) VALUES ($1, $2, $3) RETURNING id;`,
        [continent, country, name]
    );
};

module.exports.getOauthUser = async function (
    login_type,
    email,
    username,
    bio,
    picture
) {
    // console.log("writing user to db with:", arguments);
    const result = await this.getUserByEmail(email);
    if (result.rowCount === 0) {
        const newUser = await sql.query(
            `INSERT INTO USERS (username, email, password, picture, description, login_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
            [username, email, "(none)", picture, bio, login_type]
        );
        return { id: newUser?.rows[0]?.id, login_type };
    } else {
        return { id: result.rows[0].id, login_type: result.rows[0].login_type };
    }
};

module.exports.addLocationPic = function (url, id) {
    return sql.query(`UPDATE locations SET picture = $1 WHERE id = $2;`, [
        url,
        id,
    ]);
};

module.exports.updateLocationSection = async function (article) {
    const { title, content, section_id, location_id } = article;
    if (section_id) {
        return sql.query(
            "UPDATE location_sections SET title=$1, content=$2, last_updated=now() WHERE location_id=$3 AND id=$4 RETURNING id, title, content, last_updated, location_id;",
            [title.trim(), content, location_id, section_id]
        );
    }

    const existingTitles = await sql.query(
        "SELECT title FROM location_sections WHERE location_id=$1;",
        [location_id]
    );
    for (const existingTitle of existingTitles.rows) {
        if (existingTitle.title.toLowerCase() === title.toLowerCase().trim()) {
            const err = new Error("Title already exists for this Location");
            err.forClient = true;
            throw err;
        }
    }
    return sql.query(
        "INSERT INTO location_sections (location_id, title, content) VALUES ($1, $2, $3) RETURNING id, title, content, last_updated, location_id",
        [location_id, title, content]
    );
};

module.exports.addProfilePic = function (url, id) {
    return sql.query(`UPDATE users SET picture = $1 WHERE id = $2;`, [url, id]);
};

module.exports.addTripPic = function (url, id) {
    return sql.query(`UPDATE trips SET picture = $1 WHERE id = $2;`, [url, id]);
};

module.exports.addTrip = function (
    location_id,
    from_min,
    until_max,
    comment,
    userId
) {
    return sql.query(
        `INSERT INTO trips (location_id, from_min, until_max, comment, person) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at;`,
        [location_id, from_min, until_max, comment, userId]
    );
};

module.exports.toggleTripStatus = function (id) {
    return sql.query(`update trips set public=NOT public where id=$1;`, [id]);
};

module.exports.getAuthenticatedUser = async function (email, password) {
    const errorObj = {};
    try {
        const result = await this.getUserByEmail(email);
        if (result.rowCount == 1) {
            errorObj.provider = result.rows[0].login_type;
            if (result.rows[0].login_type === "local") {
                const confirmPw = await auth.compare(
                    password,
                    result.rows[0].password
                );
                if (confirmPw) {
                    return result.rows[0];
                }
                errorObj.error = "Wrong Password";
            } else {
                errorObj.error = "oauth";
            }
        }
        errorObj.error = "User not found";
    } catch (err) {
        errorObj.error = "Error in DB";
    }
    return errorObj;
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return sql.query(
        `SELECT id, password, login_type FROM users WHERE email=$1`,
        [email]
    );
};

module.exports.addResetCode = function (email, code) {
    return sql.query(
        `INSERT INTO codes (email, code) VALUES ($1, $2) RETURNING created_at;`,
        [email, code]
    );
};

module.exports.confirmCode = async function (code, validity, email) {
    // console.log("looking for codes younger than:", validity);
    try {
        const result = await sql.query(
            `SELECT code FROM codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '${validity} minutes' AND email = $1 ORDER BY id DESC;`,
            [email]
        );
        if (result.rowCount > 0) {
            return result.rows[0].code == code;
        }
        return false;
    } catch (err) {
        return err;
    }
};

module.exports.updateUserPw = function (email, hashedPw) {
    return sql.query(`UPDATE users SET password = $1 WHERE email = $2;`, [
        hashedPw,
        email,
    ]);
};

//////////////////////////////////////////////////////

module.exports.getEssentialData = async function (userId) {
    // testMongo();

    return {
        user: await this.getProfileData(userId),
        locations: await this.getLocations(),
        trips: await this.getOwnAndFriendsFutureTrips(userId),
        matches: await this.getMatches(userId),
        friendships: await this.getFriendships(userId),
    };
};

module.exports.getProfileData = function (userId) {
    return sql.query(
        `UPDATE users SET last_online=now() WHERE id=$1 RETURNING id, username, age, picture, description, experience, grade_comfort, grade_max;`,
        [userId]
    );
    //     `SELECT * FROM users WHERE id=${id} FOR UPDATE; UPDATE users SET last_online=now() WHERE id=${id};`
};

module.exports.getLocations = function () {
    return sql.query(
        `WITH average AS (SELECT location_id, AVG(rate) AS avg from location_rating GROUP BY location_id) SELECT id, continent, country, name, picture, avg FROM locations FULL JOIN average ON average.location_id=locations.id ORDER BY name;`
    );
};

module.exports.getOwnAndFriendsFutureTrips = async function (id) {
    const friends = await sql.query(
        `SELECT users.id FROM friendships JOIN users ON (recipient=${id} AND sender=users.id) OR (sender=${id} AND recipient=users.id) WHERE confirmed=true;`
    );
    const friendIds = friends.rows.map((friend) => friend.id);
    friendIds.push(id);
    return sql.query(
        `SELECT trips.id, location_id, person, from_min, until_max, comment, trips.created_at, trips.picture, username, users.picture AS user_pic, public FROM trips JOIN users ON person=users.id WHERE person=ANY($1) AND until_max>=now() ORDER BY from_min ASC;`,
        [friendIds]
    );
};

module.exports.getMatches = async function (userId) {
    const result = await sql.query(
        `WITH my_trips AS (select id, person, location_id, from_min, until_max from trips where person=$1 AND until_max>=now() AND public=true) SELECT trips.id, trips.location_id, trips.from_min, trips.until_max, trips.person, users.username, trips.comment, trips.picture, my_trips.id AS match_id, my_trips.from_min AS match_from_min, my_trips.until_max AS match_until_max FROM trips JOIN my_trips ON trips.location_id=my_trips.location_id JOiN users ON trips.person=users.id WHERE trips.person!=my_trips.person AND trips.public=true;`,
        [userId]
    );
    return analyseMatches(result.rows);
};

//////////////////////////////////////////////////////

// module.exports.getLocationMatches = function (userId) {
//     return sql.query(
//         `WITH my_trips AS (select id, person, location_id, from_min, until_max from trips where person=$1 AND until_max>=now()) SELECT trips.id, trips.location_id, trips.from_min, trips.until_max, trips.person, users.username, trips.comment, trips.picture, my_trips.id AS match_id, my_trips.from_min AS match_from_min, my_trips.until_max AS match_until_max FROM trips JOIN my_trips ON trips.location_id=my_trips.location_id JOiN users ON trips.person=users.id WHERE trips.person!=my_trips.person;`,
//         [userId]
//     );
// };

// module.exports.getTripsbyUser = async function (id) {
//     // console.log("DB query fetching TRips:");
//     const friends = await sql.query(
//         `SELECT users.id FROM friendships JOIN users ON (recipient=${id} AND sender=users.id) OR (sender=${id} AND recipient=users.id) WHERE confirmed=true;`
//     );
//     const friendIds = friends.rows.map((friend) => friend.id);
//     friendIds.push(id);
//     // console.log("id of friends:", friendIds);
//     // return sql.query(`SELECT * FROM trips WHERE person=ANY($1);`, [friendIds]);
//     return sql.query(
//         `SELECT trips.id, location_id, person, from_min, until_max, comment, trips.created_at, trips.picture, username, users.picture AS user_pic FROM trips JOIN users ON person=users.id WHERE person=ANY($1) ORDER BY from_min ASC;`,
//         [friendIds]
//     );
// };

// module.exports.getLocations = function () {
//     // console.log("DB query fetching Locations:");
//     // return sql.query(`SELECT * FROM locations;`);
//     return sql.query(
//         `WITH avg AS (SELECT location_id, AVG(rate) AS rate_avg from location_rating GROUP BY location_id) SELECT * FROM locations FULL JOIN avg ON avg.location_id=locations.id;`
//     );
// };

// module.exports.getEssentialData = async function (id) {
//     return {
//         userRaw: await this.getUserById(id, id),
//         locationsRaw: await this.getLocations(),
//         tripsRaw: await this.getTripsbyUser(id),
//     };
// };

module.exports.getUserById = function (id, userId) {
    return sql.query(
        `WITH relations as (SELECT * FROM friendships WHERE (recipient=$1 AND sender=$2) OR (sender=$1 AND recipient=$2)) SELECT username, age, picture, description, experience, grade_comfort, grade_max, confirmed, users.id FROM users LEFT OUTER JOIN relations ON users.id=relations.recipient OR users.id=relations.sender WHERE users.id=$1;`,
        [id, userId]
    );
};

module.exports.getLocationById_new = async function (id, user) {
    return {
        general: await sql.query(
            `SELECT id, continent, country, name, picture FROM locations WHERE id=${id};`
        ),
        infos: await sql.query(
            `SELECT id, title, content, last_updated from location_sections WHERE location_id=${id};`
        ),
        rating: await sql.query(
            `WITH own as (SELECT rate AS own, location_id FROM location_rating WHERE location_id=$1 AND user_id=$2) SELECT COUNT(user_id) AS sum, AVG(rate) AS avg, AVG(own) as own FROM location_rating FULL JOIN own ON own.location_id=location_rating.location_id WHERE location_rating.location_id=$1;`,
            [id, user]
        ),
    };
};

module.exports.getLocationById = async function (id) {
    return sql.query(`SELECT * FROM locations WHERE id=${id};`);
};

module.exports.getLocationRating = async function (id, user) {
    return {
        rating: await sql.query(
            `SELECT COUNT(user_id) AS sum, AVG(rate) AS avg FROM location_rating WHERE (location_id=$1);`,
            [id]
        ),
        user: await sql.query(
            `SELECT rate AS own FROM location_rating WHERE location_id=${id} AND user_id=${user}`
        ),
    };
};

module.exports.changeLocationRating = function (value, location, user) {
    let q;
    if (value == "delete") {
        // console.log("delete");
        q = `DELETE FROM location_rating WHERE location_id=${location} AND user_id=${user}`;
    } else if (value < 6 && value >= 0) {
        // console.log("number");
        q = `INSERT INTO location_rating (user_id, location_id, rate) VALUES (${user}, ${location}, ${value})`;
    }
    return sql.query(q);
};

module.exports.updateUserData = function (property, value, id) {
    // console.log("setting:", property, value, id);
    return sql.query(`UPDATE users SET ${property}=$1 WHERE id=$2;`, [
        value,
        id,
    ]);
};

module.exports.updateTripData = function (property, value, id) {
    // console.log("setting:", property, value, id);
    return sql.query(`UPDATE trips SET ${property}=$1 WHERE id=$2;`, [
        value,
        id,
    ]);
};

module.exports.getTripById = function (id) {
    return sql.query(
        `SELECT * FROM trips WHERE id=${id} ORDER BY from_min ASC;`
    );
};

module.exports.deleteTripById = function (id) {
    return sql.query(`DELETE FROM trips WHERE id=${id};`);
};

module.exports.safeFriendRequest = function (userId, friendId) {
    return sql.query(
        `INSERT INTO friendships (sender, recipient) VALUES ($1, $2);`,
        [userId, friendId]
    );
};

module.exports.confirmFriendRequest = function (userId, friendId) {
    return sql.query(
        `UPDATE friendships SET confirmed=true WHERE (sender=$1 AND recipient=$2);`,
        [friendId, userId]
    );
};

module.exports.deleteFriendRequest = function (userId, friendId) {
    return sql.query(
        `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2);`,
        [userId, friendId]
    );
};

module.exports.deleteFriendship = function (userId, friendId) {
    return sql.query(
        `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
        [userId, friendId]
    );
};

module.exports.getFriendInfo = function (userId, friendId) {
    return sql.query(
        `SELECT * FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
        [userId, friendId]
    );
};

module.exports.getFriendships = function (userId) {
    return sql.query(
        `SELECT users.id, username, users.picture, sender, recipient, confirmed FROM friendships JOIN users ON (recipient = $1 AND sender = users.id) OR (sender = $1 AND recipient = users.id);`,
        [userId]
    );
};

module.exports.getUserByTextSearch = async function (text, userId) {
    const tag = text.length > 1 ? `%${text}%` : `${text}%`;
    // console.log("DB for", tag, userId);
    return sql.query(
        `SELECT id, username, picture FROM users WHERE username ILIKE $1 AND id!=$2;`,
        [tag, userId]
    );
    //
};

module.exports.safeFriendRequest = function (userId, friendId) {
    return sql.query(
        `INSERT INTO friendships (sender, recipient) VALUES ($1, $2);`,
        [userId, friendId]
    );
};

module.exports.confirmFriendRequest = function (userId, friendId) {
    return sql.query(
        `UPDATE friendships SET confirmed=true WHERE (sender=$1 AND recipient=$2);`,
        [friendId, userId]
    );
};

module.exports.deleteFriendRequest = function (userId, friendId) {
    return sql.query(
        `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2);`,
        [userId, friendId]
    );
};

module.exports.deleteFriendship = function (userId, friendId) {
    return sql.query(
        `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
        [userId, friendId]
    );
};

module.exports.getFriendInfo = function (userId, friendId) {
    return sql.query(
        `SELECT * FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
        [userId, friendId]
    );
};

module.exports.getLastChats = function (about, id, userId, limit) {
    let q;
    if (about == "direct") {
        q = `SELECT chat.id, sender, text, chat.created_at, username, trip_origin, trip_target, location_id, read_by_recipient FROM chat JOIN users ON sender=users.id WHERE (recipient=${userId} AND sender=${id} AND trip_origin IS NULL AND trip_target IS NULL AND location_id IS NULL) OR (sender=${userId} AND recipient=${id} AND trip_origin IS NULL AND trip_target IS NULL AND location_id IS NULL) ORDER BY chat.id DESC LIMIT ${limit};`;
    } else if (about == "trip") {
        const ids = id.split("T");
        // console.log("Split ids in trip-chat-header:", ids);
        q = `SELECT chat.id, sender, text, chat.created_at, username trip_origin, trip_target, location_id, read_by_recipient FROM chat JOIN users ON sender=users.id WHERE (trip_origin=${ids[1]} AND trip_target=${ids[2]}) OR (trip_origin=${ids[2]} AND trip_target=${ids[1]}) ORDER BY chat.id DESC LIMIT ${limit};`;
    } else if (about == "location") {
        q = `SELECT chat.id, sender, text, chat.created_at, username, trip_origin, trip_target, location_id, location_topic FROM chat JOIN users ON sender=users.id WHERE location_id=${id} ORDER BY chat.id DESC LIMIT ${limit};`;
    }
    // console.log("running:", q);
    return sql.query(q);
};

module.exports.addFriendMessage = async function (sender, recipient, msg) {
    return {
        chat: await sql.query(
            `INSERT INTO chat (sender, recipient, text) VALUES ($1, $2, $3) RETURNING id, created_at, sender, recipient, text, trip_origin, trip_target, location_id;`,
            [sender, recipient, msg]
        ),
        user: await sql.query(`SELECT username from users WHERE id=$1`, [
            sender,
        ]),
    };
};

module.exports.addLocationMessage = async function (
    sender,
    location,
    topic,
    msg
) {
    return {
        chat: await sql.query(
            `INSERT INTO chat (sender, recipient, location_id, location_topic, text) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, sender, recipient, text, trip_origin, trip_target, location_id, location_topic;`,
            [sender, 0, location, topic, msg]
        ),
        user: await sql.query(`SELECT username from users WHERE id=$1`, [
            sender,
        ]),
    };
};

module.exports.addTripMessage = async function (
    sender,
    recipient,
    origin,
    target,
    msg
) {
    return {
        chat: await sql.query(
            `INSERT INTO chat (sender, recipient, trip_origin, trip_target, text) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, sender, recipient, text, trip_origin, trip_target, location_id;`,
            [sender, recipient, origin, target, msg]
        ),
        user: await sql.query(`SELECT username from users WHERE id=$1`, [
            sender,
        ]),
    };
};

module.exports.markReadMessages = async function (arrOfIds) {
    return sql.query(
        `UPDATE chat SET read_by_recipient=true WHERE id=ANY($1);`,
        [arrOfIds]
    );
};

module.exports.getActiveUsersByIds = function (arrayOfIds) {
    return sql.query(`SELECT id, username FROM users WHERE id = ANY($1);`, [
        arrayOfIds,
    ]);
};
