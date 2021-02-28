const request = require("request");
const { promisify } = require("util");
const requestPromise = promisify(request);
module.exports.getCountries = function () {
    return requestPromise(
        "http://countryapi.gear.host/v1/Country/getCountries"
    );
};
// FIXME make it REDIS
