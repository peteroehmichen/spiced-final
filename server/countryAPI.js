const db = require("./db");
const request = require("request");
const { promisify } = require("util");
const requestPromise = promisify(request);

module.exports.getCountries = async function () {
    // console.log("searching countries in Redis:");
    let countries;
    try {
        countries = await db.rdsGet("countries");
        if (countries) {
            countries = JSON.parse(countries);
            // console.log("found... returning to server");
        } else {
            // console.log("searching countries in API:");
            countries = await requestPromise(
                "http://countryapi.gear.host/v1/Country/getCountries"
            );
            if (countries) {
                // console.log("saving countries in Redis");
                db.rdsSetex(
                    "countries",
                    60 * 60 * 24,
                    JSON.stringify(countries)
                );
                // console.log("returning to server");
            }
        }
    } catch (error) {
        console.log("Error in REDIS hit:", error);
    }

    // try to get countries from Redis
    // if successfull, feed back
    // if not successfull, fetch from API, save in Redis (value daily) and return it

    return countries;
};
// module.exports.getCountries = function () {
//     return requestPromise(
//         "http://countryapi.gear.host/v1/Country/getCountries"
//     );
// };
// FIXME make it REDIS
