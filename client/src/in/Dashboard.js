import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Matches from "./Matches";

export default function Dashboard() {
    const { user, trips, locations } = useSelector((store) => store);

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
                                        ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>Trips that match your plans </h3>
                        <div className="container-frame">
                            <div className="card-container wrapped">
                                <Matches mode="dashboard" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Notifications</h3>
                        <div className="temp">comming soon...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
