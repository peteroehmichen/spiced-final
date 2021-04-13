const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/in/addLocationSection.json", async (req, res) => {
    try {
        const result = await db.addLocationSection(
            req.body.title,
            req.body.content,
            req.body.id,
            req.body.prev
        );
        if (result.rowCount > 0) {
            return res.json({ success: result.rows[0], error: false });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notifications",
                    text: "Database denied new Information",
                },
            });
        }
    } catch (err) {
        console.log("Error in trip-Update:", err);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Failed Connection to Database",
            },
        });
    }
});

router.get("/in/addLocation.json", async (req, res) => {
    // console.log("receiving:", req.query);
    const { continent, country, name } = req.query;
    try {
        const result = await db.addLocation(continent, country, name);
        // console.log("checking:", result);
        if (result.rowCount > 0) {
            req.query.id = result.rows[0].id;
            return res.json({
                success: req.query,
                error: false,
            });
        } else {
            res.json({
                success: false,
                error: {
                    type: "notifications",
                    text: "Error in writing to Database",
                },
            });
        }
    } catch (err) {
        console.log("checking Error:", err);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Failed Connection to Database",
            },
        });
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
        const result = await db.getLocationById(req.query.id);
        if (result.rowCount > 0) {
            const ratings = await db.getLocationRating(
                req.query.id,
                req.session.userId
            );
            let locationData = {
                ...result.rows[0],
                ...ratings.rating.rows[0],
                own: ratings.user.rows[0]?.own || false,
            };
            return res.json({ success: locationData, error: false });
        } else {
            res.json({
                success: false,
                error: { type: "component", text: "Location unkown" },
            });
        }
    } catch (err) {
        console.log("Error in getting location details:", err);
        res.json({
            success: false,
            error: {
                type: "component",
                text: "Failed Connection to Database",
            },
        });
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

module.exports = router;