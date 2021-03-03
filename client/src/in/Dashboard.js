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
            <Matches limit="0" mode="dashboard" />

            <h1>Your Friends Trips</h1>
            <div className="card-container">
                {trips &&
                    locations &&
                    user &&
                    trips
                        .filter((trip) => trip.person != user.id)
                        .map((elem, i) => (
                            <div className="card small" key={i}>
                                <div className="card-thumb">
                                    <img src="/default.svg" />
                                </div>
                                <div className="card-image">
                                    <img src="/default.svg" />
                                </div>
                                <div className="card-text">
                                    <h4>
                                        {elem.first} {elem.last[0]}.
                                    </h4>
                                    <p>
                                        {new Date(
                                            elem.from_min
                                        ).toLocaleDateString()}{" "}
                                        -{" "}
                                        {new Date(
                                            elem.until_max
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="card-foot"></div>
                            </div>
                        ))}
            </div>
        </div>
    );
}
