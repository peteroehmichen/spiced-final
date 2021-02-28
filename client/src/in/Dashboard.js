import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrips, getUserData } from "../helpers/actions";
import axios from "../helpers/axios";
import Matches from "./Matches";

/*
Summary from other Elements
- trips I have planned
- friends and their trips
- locations I follow
*/

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user, grades, experience, trips, locations } = useSelector(
        (store) => store
    );
    // const dispatch = useDispatch();
    // const [countries, setCountries] = useState([]);

    useEffect(async () => {
        dispatch(getTrips());
    }, []);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    // if (!user || !grades || !experience) return null;

    return (
        <div className="central dashboard">
            <ul className="todo">
                <li>view my trips</li>
                <li>view pinned friends trips</li>
                <li>(maybe notifications)</li>
            </ul>
            <h1>Dashboard</h1>
            <h2>Your Friends Trips</h2>
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
            <Matches />
        </div>
    );
}
