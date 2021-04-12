import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader } from "../helpers/helperComponents";
import Matches from "./Matches";

export default function Dashboard() {
    const { user, trips, locations } = useSelector((store) => store);
    let otherTrips;
    if (trips) {
        otherTrips = trips.filter((trip) => trip.person != user.id);
    }

    return (
        <div className="central social">
            <div className="logoStartFrame">
                <img className="logoStart" src="/noun_Rope_61701.png" />
                <h1>THE SHARP END</h1>
                <h4>a network for travelling climbers</h4>
            </div>
            <div className="friend-two">
                <div className="grow-split">
                    <div>
                        <div>
                            <h3>What your friends are planning</h3>
                        </div>
                        {!trips || !locations || !user ? (
                            <Loader />
                        ) : (
                            <div className="container-frame">
                                <div className="card-container wrapped">
                                    {otherTrips.length == 0 ? (
                                        <p>there are none</p>
                                    ) : (
                                        otherTrips.map((elem, i) => (
                                            <Link
                                                key={i}
                                                to={`/user/${elem.person}`}
                                            >
                                                <div className="card small">
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
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <div>
                            <h3>Trips that match your plans </h3>
                        </div>
                        <div className="container-frame">
                            <div className="card-container wrapped">
                                <Matches mode="dashboard" />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: "#fdc05480",
                        }}
                    >
                        <div>
                            <h3>Next major steps for Development</h3>
                        </div>
                        <div>
                            <ul>
                                <li>OAuth 2.0 (first GitHub, later more)</li>
                                <li>
                                    Notfication System for live-Matches,
                                    Friendships, Errors, etc.
                                </li>
                                <li>
                                    Mobile Friendly Design and Switch to
                                    Tailwind
                                </li>
                                <li>
                                    Added feature for regular Climbing Buddies
                                    (maybe with maps API)
                                </li>
                                <li>Full Review on Dashboard</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
