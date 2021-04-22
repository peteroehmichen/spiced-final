module.exports.analyseMatches = function (locationMatches) {
    // console.log("analyzing...", locationMatches);
    let overlappingTrips = locationMatches.filter(
        (trip) =>
            trip.until_max >= trip.match_from_min &&
            trip.match_until_max >= trip.from_min
    );

    overlappingTrips = overlappingTrips.map((trip) => {
        trip.match_duration =
            1 +
            (trip.match_until_max - trip.match_from_min) /
                (1000 * 60 * 60 * 24);

        if (trip.match_from_min < trip.from_min) {
            // I arrive earlier
            if (trip.match_until_max < trip.until_max) {
                // "I leave earlier"
                trip.match_overlap = trip.match_until_max - trip.from_min;
            } else if (trip.match_until_max == trip.until_max) {
                // "I leave the same day"
                trip.match_overlap = trip.match_until_max - trip.from_min;
            } else {
                trip.match_overlap = trip.until_max - trip.from_min;
            }
        } else if (trip.match_from_min == trip.from_min) {
            // "I arrive the same day"
            if (trip.match_until_max < trip.until_max) {
                // "I leave earlier"
                trip.match_overlap = trip.match_until_max - trip.match_from_min;
            } else if (trip.match_until_max == trip.until_max) {
                // "I leave the same day"
                trip.match_overlap = trip.match_until_max - trip.match_from_min;
            } else {
                trip.match_overlap = trip.until_max - trip.from_min;
            }
        } else {
            // I arrive later
            if (trip.match_until_max < trip.until_max) {
                // "I leave earlier"
                trip.match_overlap = trip.match_until_max - trip.match_from_min;
            } else if (trip.match_until_max == trip.until_max) {
                // "I leave the same day"
                trip.match_overlap = trip.match_until_max - trip.match_from_min;
            } else {
                trip.match_overlap = trip.until_max - trip.match_from_min;
            }
        }
        trip.match_overlap = 1 + trip.match_overlap / (1000 * 60 * 60 * 24);
        trip.match_overlap_percent = Math.floor(
            (trip.match_overlap * 100) / trip.match_duration
        );
        return trip;
    });
    return overlappingTrips;
};
