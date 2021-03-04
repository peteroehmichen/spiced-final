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

    // <Matches limit="0" mode="dashboard" />

    return (
        <div className="central social">
            <div className="friend-one">
                <h1>Welcome, PPPPP</h1>
            </div>
            <div className="friend-two">
                <div className="grow-split">
                    <div>
                        <h3>What your friends are planning</h3>
                        <div className="container-frame">
                            <div className="card-container wrapped">
                                {trips &&
                                    locations &&
                                    user &&
                                    trips
                                        .filter(
                                            (trip) => trip.person != user.id
                                        )
                                        .map((elem, i) => (
                                            <div className="card small" key={i}>
                                                <div className="card-image">
                                                    <img
                                                        src={
                                                            elem.picture ||
                                                            elem.user_pic ||
                                                            "/default.svg"
                                                        }
                                                    />
                                                </div>
                                                <div className="card-text">
                                                    <h4>
                                                        {elem.first}{" "}
                                                        {elem.last[0]}.
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
                    </div>

                    <div>
                        <h3>Matching Trips</h3>
                        <div className="container-frame">
                            <div className="card-container wrapped">
                                <Matches mode="dashboard" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Notifications</h3>
                        <div className="container-frame">
                            <div className="card-container wrapped">...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
