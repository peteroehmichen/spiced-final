const express = require("express");
const { errorObj } = require("../globalHelpers/helpers");
const router = express.Router();
const db = require("./db");

router.post("/in/updateLocationSection.json", async (req, res) => {
    try {
        const result = await db.updateLocationSection(
            req.body,
            req.session.userId
        );
        if (!result.rowCount) {
            console.log("Unknown error in Location-Update:", result);
            throw new Error();
        }

        res.json({ success: result.rows[0] });
    } catch (error) {
        console.log("Error in section-Update:", error.message);
        res.json(errorObj("notification", "Database rejected new information"));
    }
});

router.get("/in/addLocation.json", async (req, res) => {
    // console.log("receiving:", req.query);
    const { continent, country, name } = req.query;
    try {
        const result = await db.addLocation(continent, country, name);

        if (!result.rowCount) {
            console.log("Error from DB:", result);
            throw new Error();
        }

        req.query.id = result.rows[0].id;
        return res.json({
            success: req.query,
            error: false,
        });
    } catch (err) {
        console.log("checking Error:", err);
        res.json(errorObj("notification", "Error in writing to Database"));
    }
});

router.get("/in/getLocations.json", async (req, res) => {
    // console.log("fetching locations");
    try {
        const result = await db.getLocations();
        // console.log("from DB:", result.rows);
        if (result.rows) {
            res.json({
                success: result.rows,
                error: false,
            });
        } else {
            console.log("DB-Rejection:", result);
            res.json({
                success: false,
                error: { type: "notifications", text: "DB rejected command" },
            });
        }
    } catch (error) {
        console.log("DB-Error:", error);
        res.json({
            success: false,
            error: { type: "notifications", text: "Failed Connection to DB" },
        });
    }
});

router.get("/in/locationData.json", async (req, res) => {
    try {
        const { general, rating, infos } = await db.getLocationById(
            req.query.id,
            req.session.userId
        );
        if (!general.rowCount) {
            throw new Error("Location unknown");
        }
        const locationDetails = {
            ...general.rows[0],
            ...rating.rows[0],
            infos: infos.rows,
        };
        return res.json({
            success: locationDetails,
            error: false,
        });
    } catch (err) {
        console.log("Error in getting location details:", err);
        res.json(errorObj("component", err.message));
    }
});

router.get("/in/changeLocationRating.json", async (req, res) => {
    try {
        await db.changeLocationRating(
            req.query.value,
            req.query.id,
            req.session.userId
        );
        const results = await db.getLocationRating(
            req.query.id,
            req.session.userId
        );
        let rating = results.rating.rows[0];
        rating.location_id = req.query.id;
        rating.own = results.user.rows.length
            ? results.user.rows[0].own
            : false;
        res.json({ success: rating, error: false });
    } catch (error) {
        console.log("Error in updating rating:", error);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Could not add Rating to Database",
            },
        });
    }
});

router.post("/in/voteLocationSection.json", async (req, res) => {
    try {
        const result = await db.voteLocationSection(
            req.body.section_id,
            req.body.vote,
            req.session.userId
        );
        // console.log(result.rows[0])
        res.json({ success: { rowCount: result.rowCount, newSum: result.rows[0]?.summed_votes, vote: req.body.vote, section_id: req.body.section_id } });
    } catch (error) {
        console.log("error in vote:", error);
        res.json(errorObj("notification", "Could not cast your vote"));
    }
});

module.exports = router;
