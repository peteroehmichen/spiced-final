const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/in/matches.json", async (req, res) => {
    try {
        const { rows: matches } = await db.getMatches(req.session.userId);
        const filteredMatches = matches.filter(
            (trip) =>
                trip.until_max >= trip.match_from_min &&
                trip.match_until_max >= trip.from_min
        );

        const formattedMatches = filteredMatches.map((trip) => {
            trip.match_duration =
                1 +
                (trip.match_until_max - trip.match_from_min) /
                    (1000 * 60 * 60 * 24);

            if (trip.match_from_min < trip.from_min) {
                // I arrive earlier
                if (trip.match_until_max < trip.until_max) {
                    // "I leave earlier"
                    // my max - their arrival
                    trip.match_overlap = trip.match_until_max - trip.from_min;
                } else if (trip.match_until_max == trip.until_max) {
                    // "I leave the same day"
                    // my max - their arrival
                    trip.match_overlap = trip.match_until_max - trip.from_min;
                } else {
                    // their max - their arrival
                    trip.match_overlap = trip.until_max - trip.from_min;
                }
            } else if (trip.match_from_min == trip.from_min) {
                // "I arrive the same day"
                if (trip.match_until_max < trip.until_max) {
                    // "I leave earlier"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else if (trip.match_until_max == trip.until_max) {
                    // "I leave the same day"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else {
                    // their max - their min
                    trip.match_overlap = trip.until_max - trip.from_min;
                }
            } else {
                // I arrive later
                if (trip.match_until_max < trip.until_max) {
                    // "I leave earlier"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else if (trip.match_until_max == trip.until_max) {
                    // "I leave the same day"
                    // my max - my min
                    trip.match_overlap =
                        trip.match_until_max - trip.match_from_min;
                } else {
                    // their max - my min
                    trip.match_overlap = trip.until_max - trip.match_from_min;
                }
            }
            trip.match_overlap = 1 + trip.match_overlap / (1000 * 60 * 60 * 24);
            trip.match_overlap_percent = Math.floor(
                (trip.match_overlap * 100) / trip.match_duration
            );
            return trip;
        });
        res.json({ success: formattedMatches, error: false });
    } catch (error) {
        console.log("error:", error);
        res.json({
            success: false,
            error: {
                type: "notifications",
                text: "Could not fetch matches from Server",
            },
        });
    }
});

module.exports = router;
