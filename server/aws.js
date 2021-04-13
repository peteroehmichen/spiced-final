const aws = require("aws-sdk");
const cryptoRandomString = require("crypto-random-string");
const { S3URL } = require("./config.json");
const multer = require("multer");
const uidSafe = require("uid-safe");
const fs = require("fs");
const path = require("path");

const ses = new aws.SES({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "eu-central-1",
});

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

module.exports.uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

module.exports.uploadToAWS = async function (req) {
    if (!req.file) {
        return { error: "File does not match standards" };
    }
    const { filename, mimetype, size, path } = req.file;
    await s3
        .putObject({
            Bucket: "oehmichen-messageboard",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    fs.unlink(path, () => {});
    // console.log("AWS was successful with: ", S3URL + req.file.filename);
    return { url: S3URL + req.file.filename };
};

module.exports.deleteFromAWS = async (url) => {
    if (url.startsWith(S3URL)) {
        const filename = url.replace(S3URL, "");
        const params = {
            Bucket: "oehmichen-messageboard",
            Key: filename,
        };
        try {
            await s3.deleteObject(params).promise();
            // console.log("S3 Picture deleted");
            return { success: true };
        } catch (error) {
            console.log("S3 deletion error", error);
            return { success: false };
        }
    } else {
        // console.log("no linked passed for deletion");
        return { success: true };
    }
};

module.exports.sendEMail = function (recipient) {
    const newCode = cryptoRandomString({ length: 6 });
    return ses
        .sendEmail({
            Source: "The Makers of The Sharp End <oehmichenp@gmail.com>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `The code to reset your password is ${newCode}.`,
                    },
                },
                Subject: {
                    Data:
                        "THE SHARP END: Your Validation Code for Password Reset",
                },
            },
        })
        .promise()
        .then(() => newCode)
        .catch((err) => {
            console.log("error on AWS SES:", err);
        });
};
