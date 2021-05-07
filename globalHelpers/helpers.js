module.exports.errorReturn = function (
    error,
    message = "Failed Connection to Database"
) {
    const obj = {
        success: false,
        error: {
            type: "notification",
            text: error.forClient ? error.message : message,
        },
    };
    return obj;
};
