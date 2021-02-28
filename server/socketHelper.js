const db = require("./db");

module.exports.activeUsers = async function (activeSockets) {
    const newObj = {};
    const newArr = Object.entries(activeSockets);
    for (let i = 0; i < newArr.length; i++) {
        newObj[newArr[i][1]] = newArr[i][0];
    }
    const arrOfTrueIds = Object.keys(newObj);

    let data;
    try {
        const { rows } = await db.getActiveUsersByIds(arrOfTrueIds);
        data = rows;
    } catch (error) {
        console.log("caught an error:", error);
        data = {
            error: "This is a temporary Error",
        };
    }

    return data;
};
