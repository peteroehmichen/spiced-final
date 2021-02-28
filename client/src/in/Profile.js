/*
Add new Locations
Edit Locations
Rate Locations
*/

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrips, toggleTripForm } from "../helpers/actions";
import NewTrip from "./NewTrip";

export default function Profile() {
    const dispatch = useDispatch();
    const {
        trips,
        activeTripForm,
        locations,
        user,
        grades,
        experience,
    } = useSelector((store) => store);

    useEffect(() => {
        dispatch(getTrips());
    }, []);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    // if (!user || !trips) return null;
    // console.log(trips);
    return (
        <div className="central trips">
            <h1>Your Profile Data</h1>
            {user && grades && experience && (
                <div>
                    <p>
                        <b>Your Name:</b> {user.first} {user.last}
                    </p>
                    <p>
                        <b>Your Age:</b> {user.age}
                    </p>
                    <p>
                        <b>Your E-Mail:</b> {user.email}
                    </p>
                    <p>
                        <b>Your Location:</b> {user.location}
                    </p>
                    <p>
                        <b>Your Climbing Grade:</b> {grades[user.grade_comfort]}{" "}
                        up to {grades[user.grade_max]}
                    </p>
                    <p>
                        <b>Your Experience:</b> {experience[user.experience]}
                    </p>
                    <p>
                        <b>Brief Description:</b> {user.description}
                    </p>
                </div>
            )}
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
        </div>
    );
}
