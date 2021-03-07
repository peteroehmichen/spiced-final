const db = require("./db");
const request = require("request");
const { promisify } = require("util");
const requestPromise = promisify(request);

module.exports.getCountries = async function () {
    let countries = await db.rdsGet("countries");
    if (countries) {
        countries = JSON.parse(countries);
    } else {
        countries = await requestPromise(
            "http://countryapi.gear.host/v1/Country/getCountries"
        );
        if (countries) {
            db.rdsSetex("countries", 60 * 60 * 24, JSON.stringify(countries));
        }
    }
    return countries;
};
// module.exports.getCountries = function () {
//     return requestPromise(
//         "http://countryapi.gear.host/v1/Country/getCountries"
//     );
// };
