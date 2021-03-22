const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("./db");
const auth = require("./auth");
const aws = require("./aws");
const { CODE_VALIDITY_IN_MINUTES } = require("./config.json");

router.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

router.post("/welcome/register.json", async (req, res) => {
    const { first, last, email, password } = req.body;
    if (first == "" || last == "" || !email.includes("@") || password == "") {
        return res.json({
            error: "Prohibited input",
        });
    }
    try {
        const hashedPw = await auth.hash(password);
        const result = await db.addUser(first, last, email, hashedPw);
        req.session.userId = result.rows[0].id;
        res.json({ status: "OK" });
    } catch (err) {
        if (err.code == "23505") {
            res.json({ error: "E-Mail already exists" });
        } else {
            res.json({ error: "Server error" });
        }
    }
});

router.post("/welcome/login.json", async (req, res) => {
    console.log("received:", req.body);
    try {
        const result = await db.getAuthenticatedUser(
            req.body.email,
            req.body.password
        );
        if (result.id) {
            req.session.userId = result.id;
            res.json({
                status: "OK",
            });
        } else {
            console.log("Login-Error:", result);
            if (result.error == "Error in DB") {
                res.json({ error: "No Connection" });
            } else {
                res.json({ error: "Invalid user credentials" });
            }
        }
    } catch (err) {
        res.json({ error: "Log in rejected" });
    }
});

router.post("/welcome/reset.json", async (req, res) => {
    try {
        const user = await db.getUserByEmail(req.body.email);
        if (user.rowCount > 0) {
            const code = await aws.sendEMail(req.body.email);
            const result = await db.addResetCode(req.body.email, code);
            if (result.rowCount > 0) {
                const start = new Date(result.rows[0].created_at);
                const end = new Date(
                    start.getTime() + CODE_VALIDITY_IN_MINUTES * 60000
                ).valueOf();
                res.json({ codeValidUntil: end });
            } else {
                res.json({
                    error: "Couldn't read DB",
                });
            }
        } else {
            res.json({ error: "User not found" });
        }
    } catch (err) {
        res.json({ error: "Unknown error in DB" });
    }
});

router.post("/welcome/code.json", async (req, res) => {
    try {
        const isCodeValid = await db.confirmCode(
            req.body.code,
            CODE_VALIDITY_IN_MINUTES.toString(),
            req.body.email
        );
        if (isCodeValid) {
            const hashedPw = await auth.hash(req.body.password);
            const result = await db.updateUserPw(req.body.email, hashedPw);
            if (result.rowCount > 0) {
                res.json({ update: "ok" });
            } else {
                res.json({ error: "Error in password-reset" });
            }
        } else {
            res.json({ error: "Invalid code" });
        }
    } catch (err) {
        res.json({ error: "Unknown error" });
    }
});

module.exports = router;
