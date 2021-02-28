import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findMatchingTrips } from "../helpers/actions";

export default function Matches() {
    const { matches, locations, trips, user } = useSelector((store) => store);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(findMatchingTrips());
    }, []);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    return (
        <div>
            <h1>Matches</h1>
            <ul>
                {trips &&
                    matches &&
                    user &&
                    locations &&
                    matches.map((elem, i) => (
                        <li key={i}>
                            {elem.first}s trip to{" "}
                            {getLocationName(elem.location_id)} (
                            {new Date(elem.from_min).toLocaleDateString()} -{" "}
                            {new Date(elem.until_max).toLocaleDateString()}{" "}
                            matches by {elem.match_overlap_percent}%
                        </li>
                    ))}
            </ul>
        </div>
    );
}
