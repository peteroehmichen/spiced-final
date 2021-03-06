const db = require("./db");
const axios = require("axios");

module.exports.getCountries = async function () {
    let countries = await db.rdsGet("countries");
    if (countries) {
        return JSON.parse(countries);
    }
    return axios
        .get("http://countryapi.gear.host/v1/Country/getCountries")
        .then(({ data }) => {
            if (data.Response) {
                db.rdsSetex(
                    "countries",
                    60 * 60 * 24,
                    JSON.stringify(data.Response)
                );
            }
            return data.Response;
        })
        .catch((err) => {
            console.log("error in fetching countries:", err);
        });
};
