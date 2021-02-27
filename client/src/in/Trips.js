/*
Add new Locations
Edit Locations
Rate Locations
*/

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrips, toggleTripForm } from "../helpers/actions";
import NewTrip from "./NewTrip";

export default function Trips() {
    const dispatch = useDispatch();
    const { trips, activeTripForm, locations, user } = useSelector(
        (store) => store
    );

    useEffect(() => {
        dispatch(getTrips());
    }, []);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    // if (!locations) return null;
    // console.log(trips);
    return (
        <div className="central trips">
            <h1>Your Trips</h1>
            <ul>
                {trips &&
                    locations &&
                    user &&
                    trips
                        .filter((trip) => trip.person == user.id)
                        .map((elem, i) => (
                            <li key={i}>
                                {getLocationName(elem.location_id)} --{" "}
                                {new Date(elem.from_min).toLocaleDateString()} -{" "}
                                {new Date(elem.until_max).toLocaleDateString()}:
                                ({elem.comment})
                            </li>
                        ))}
            </ul>
            <div className="new">
                {!activeTripForm && (
                    <button
                        onClick={() => {
                            dispatch(toggleTripForm());
                        }}
                    >
                        Add new Trip
                    </button>
                )}
                {activeTripForm && <NewTrip />}
            </div>
            <h1>Your Friends Trips</h1>
            <ul>
                {trips &&
                    locations &&
                    user &&
                    trips
                        .filter((trip) => trip.person != user.id)
                        .map((elem, i) => (
                            <li key={i}>
                                {elem.first} {elem.last} ||
                                {getLocationName(elem.location_id)} --{" "}
                                {new Date(elem.from_min).toLocaleDateString()} -{" "}
                                {new Date(elem.until_max).toLocaleDateString()}:
                                ({elem.comment})
                            </li>
                        ))}
            </ul>
        </div>
    );
}
