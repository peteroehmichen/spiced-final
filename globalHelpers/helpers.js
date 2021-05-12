/**
 *
 * @param {*} type string of either "notification", "component" or "essential"
 * @param {*} message string of displayed message as toast, instead of component or to previous to forced logout
 * @returns standardized error object
 */
module.exports.errorObj = function (type, message) {
    const acceptedTypes = ["notification", "component", "essential"];
    const obj = {
        success: false,
        error: {
            type: acceptedTypes.includes(type) ? type : "notification",
            text: typeof message === "string" ? message : "Unknown Error",
        },
    };
    return obj;
};
