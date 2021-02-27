const auth = require("./auth");
const spicedPg = require("spiced-pg");
const sql = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/final-project"
);

module.exports.addUser = function (first, last, email, hashedPW) {
    return sql.query(
        `INSERT INTO USERS (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [first, last, email, hashedPW]
    );
};

module.exports.addLocation = function (continent, country, name) {
    // console.log("DB query with:", continent, country, name);
    return sql.query(
        `INSERT INTO locations (continent, country, name) VALUES ($1, $2, $3) RETURNING id;`,
        [continent, country, name]
    );
};

module.exports.getLocations = function () {
    // console.log("DB query fetching Locations:");
    return sql.query(`SELECT * FROM locations;`);
};

module.exports.getTripsbyUser = async function (id) {
    // console.log("DB query fetching Locations:");
    const friends = await sql.query(
        `SELECT users.id FROM friendships JOIN users ON (recipient=${id} AND sender=users.id) OR (sender=${id} AND recipient=users.id) WHERE confirmed=true;`
    );
    const friendIds = friends.rows.map((friend) => friend.id);
    friendIds.push(id);
    console.log("id of friends:", friendIds);
    // return sql.query(`SELECT * FROM trips WHERE person=ANY($1);`, [friendIds]);
    return sql.query(
        `SELECT trips.id, location_id, person, from_min, until_max, comment, trips.created_at, first, last FROM trips JOIN users ON person=users.id WHERE person=ANY($1);`,
        [friendIds]
    );
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

module.exports.getAuthenticatedUser = async function (email, password) {
    try {
        const result = await this.getUserByEmail(email);
        if (result.rowCount == 1) {
            const confirmPw = await auth.compare(
                password,
                result.rows[0].password
            );
            if (confirmPw) {
                return result.rows[0];
            }
            return { error: "Wrong Password" };
        }
        return { error: "User not found" };
    } catch (err) {
        return { error: "Error in DB" };
    }
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return sql.query(`SELECT id, password FROM users WHERE email=$1`, [email]);
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

module.exports.getEssentialData = async function (id) {
    return {
        userRaw: await this.getUserById(id),
        locationsRaw: await this.getLocations(),
        tripsRaw: await this.getTripsbyUser(id),
    };
};

module.exports.getUserById = function (id) {
    return sql.query(
        `SELECT * FROM users WHERE id=${id} FOR UPDATE; UPDATE users SET last_online=now() WHERE id=${id};`
    );
};

module.exports.updateUserData = function (
    age,
    location,
    grade_comfort,
    grade_max,
    description,
    experience,
    id
) {
    return sql.query(
        `UPDATE users SET age=$1, location=$2, grade_comfort=$3, grade_max=$4, description=$5, experience=$6 WHERE id = $7;`,
        [age, location, grade_comfort, grade_max, description, experience, id]
    );
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
        `SELECT users.id, first, last, sender, recipient, confirmed FROM friendships JOIN users ON (recipient = $1 AND sender = users.id) OR (sender = $1 AND recipient = users.id);`,
        [userId]
    );
};

// module.exports.addProfilePic = function (url, id) {
//     return sql.query(`UPDATE users SET profile_pic_url = $1 WHERE id = $2;`, [
//         url,
//         id,
//     ]);
// };

// // module.exports.getUserById = function getUserByEmail(id) {
// //     return sql.query(`SELECT * FROM users WHERE id=$1`, [id]);
// // };

// module.exports.getUserByTextSearch = async function (text, userId) {
//     const tag = text.length > 1 ? `%${text}%` : `${text}%`;
//     return {
//         first: await sql.query(
//             `SELECT id, first, last, profile_pic_url, bio FROM users WHERE first ILIKE $1 AND id!=$2;`,
//             [tag, userId]
//         ),
//         last: await sql.query(
//             `SELECT id, first, last, profile_pic_url, bio FROM users WHERE last ILIKE $1 AND id!=$2;`,
//             [tag, userId]
//         ),
//     };
//     //
// };

// module.exports.getMostRecentUsers = function (limit, userId) {
//     return sql.query(
//         `SELECT id, first, last, profile_pic_url, bio FROM users WHERE id!=$1 ORDER BY id DESC LIMIT $2;`,
//         [userId, limit]
//     );
// };

// module.exports.safeFriendRequest = function (userId, friendId) {
//     return sql.query(
//         `INSERT INTO friendships (sender, recipient) VALUES ($1, $2);`,
//         [userId, friendId]
//     );
// };

// module.exports.confirmFriendRequest = function (userId, friendId) {
//     return sql.query(
//         `UPDATE friendships SET confirmed=true WHERE (sender=$1 AND recipient=$2);`,
//         [friendId, userId]
//     );
// };

// module.exports.deleteFriendRequest = function (userId, friendId) {
//     return sql.query(
//         `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2);`,
//         [userId, friendId]
//     );
// };

// module.exports.deleteFriendship = function (userId, friendId) {
//     return sql.query(
//         `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
//         [userId, friendId]
//     );
// };

// module.exports.getFriendInfo = function (userId, friendId) {
//     return sql.query(
//         `SELECT * FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
//         [userId, friendId]
//     );
// };

// module.exports.getAllRelations = function (userId) {
//     return sql.query(
//         `SELECT users.id, first, last, profile_pic_url, sender, recipient, confirmed FROM friendships JOIN users ON (recipient = $1 AND sender = users.id) OR (sender = $1 AND recipient = users.id);`,
//         [userId]
//     );
// };

// module.exports.getLastChats = function (userId, recipientId) {
//     let q;
//     if (recipientId == 0) {
//         q = `WITH lowestID AS (SELECT MIN(id) FROM chat WHERE recipient=0 AND response_to=0 LIMIT 10) SELECT chat.id, response_to, text, chat.created_at, first, last, profile_pic_url FROM chat JOIN users ON sender=users.id JOIN lowestID ON chat.id>=lowestId.min WHERE recipient=0 ORDER BY chat.id DESC;`;
//     } else {
//         q = `WITH lowestID AS (SELECT MIN(id) FROM chat WHERE (recipient=${userId} AND sender=${recipientId} AND response_to=0) OR (sender=${userId} AND recipient=${recipientId} AND response_to=0) LIMIT 10) SELECT chat.id, response_to, text, chat.created_at, first, last, profile_pic_url FROM chat JOIN users ON sender=users.id JOIN lowestID ON chat.id>=lowestId.min WHERE (recipient=${recipientId} AND sender=${userId}) OR (sender=${recipientId} AND recipient=${userId})ORDER BY chat.id DESC;`;
//     }

//     // if (recipientId == 0) {
//     //     q = `SELECT chat.id, response_to, text, chat.created_at, first, last, profile_pic_url FROM chat JOIN users ON sender = users.id WHERE recipient=0 ORDER BY chat.id DESC LIMIT 10;`;
//     // } else {
//     //     q = `SELECT chat.id, response_to, text, chat.created_at, first, last, profile_pic_url FROM chat JOIN users ON sender = users.id WHERE (recipient=${userId} AND sender=${recipientId}) OR (sender=${userId} AND recipient=${recipientId}) ORDER BY chat.id DESC LIMIT 10;`;
//     // }

//     return sql.query(q);
// };

// module.exports.addNewMessage = async function (
//     sender,
//     replyTo,
//     recipient,
//     msg
// ) {
//     // console.log("new CHAT from", sender);
//     // console.log("new CHAT for", recipient);
//     // console.log("with", msg);
//     return {
//         chat: await sql.query(
//             `INSERT INTO chat (response_to, sender, recipient, text) VALUES ($1, $2, $3, $4) RETURNING id, response_to, created_at, recipient, text;`,
//             [replyTo, sender, recipient, msg]
//         ),
//         user: await sql.query(
//             `SELECT first, last, profile_pic_url from users WHERE id=$1`,
//             [sender]
//         ),
//     };
// };

// module.exports.deleteAllUserData = async function (id) {
//     const chat = await sql.query(
//         `DELETE FROM chat WHERE sender=$1 OR recipient=$1`,
//         [id]
//     );
//     const friendships = await sql.query(
//         `DELETE FROM friendships WHERE sender=$1 OR recipient=$1`,
//         [id]
//     );
//     const mail = await sql.query(`SELECT email FROM users WHERE id=$1`, [id]);
//     const codes = await sql.query(`DELETE FROM codes WHERE email=$1`, [
//         mail.rows[0].email,
//     ]);
//     const users = await sql.query(`DELETE FROM users WHERE id=$1`, [id]);
//     return {
//         chat: chat,
//         friendships: friendships,
//         mail: mail.rows[0].email,
//         users: users,
//     };
// };

// module.exports.getActiveUsersByIds = function (arrayOfIds) {
//     return sql.query(
//         `SELECT id, first, last, profile_pic_url FROM users WHERE id = ANY($1);`,
//         [arrayOfIds]
//     );
// };
