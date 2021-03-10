import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../helpers/actions";
import FriendButton from "./FriendBtn";
import Matches from "./Matches";
import Chat from "./Chat";

export default function User(props) {
    const [activeMatches, setActiveMatches] = useState(true);

    const dispatch = useDispatch();
    const {
        otherUser: other,
        grades,
        experience,
        matches,
        trips,
        locations,
    } = useSelector((store) => store);

    useEffect(async () => {
        dispatch(getUserData(props.match.params.id));
        // dispatch(getTrips());
    }, []);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    // if (!other.first && !other.error) return null;

    const otherUser = (
        <div className="central user">
            {other && grades && experience && (
                <div id="user-detail-left">
                    <div id="user-detail-head">
                        <div id="user-detail-image-frame">
                            <img src={other.picture || "/default.svg"} />
                        </div>
                        <div id="user-detail-description">
                            <h1>
                                {other.first} {other.last}
                            </h1>
                            {other.age && (
                                <p>
                                    <b>Age:</b> {other.age}
                                </p>
                            )}
                            {other.location && (
                                <p>
                                    <b>Location:</b> {other.location}
                                </p>
                            )}
                            {other.grade_comfort && other.grade_max && (
                                <p>
                                    <b>Climbing Grade:</b>{" "}
                                    {grades[other.grade_comfort]} up to{" "}
                                    {grades[other.grade_max]}
                                </p>
                            )}
                            {other.experience && (
                                <p>
                                    <b>Experience:</b>{" "}
                                    {experience[other.experience]}
                                </p>
                            )}
                            {other.description && (
                                <p>
                                    <b>Description:</b> {other.description}
                                </p>
                            )}

                            <FriendButton friendId={props.match.params.id} />
                        </div>
                    </div>
                    <h2>
                        {(other.confirmed && (
                            <Fragment>
                                <span
                                    style={
                                        (activeMatches && {
                                            textDecoration: "underline",
                                            fontWeight: "bold",
                                        }) || {
                                            textDecoration: "none",
                                            fontWeight: "normal",
                                            cursor: "pointer",
                                        }
                                    }
                                    onClick={() => {
                                        setActiveMatches(true);
                                    }}
                                >
                                    MATCHES
                                </span>
                                {"  "}|{"  "}
                                <span
                                    style={
                                        (!activeMatches && {
                                            textDecoration: "underline",
                                            fontWeight: "bold",
                                        }) || {
                                            textDecoration: "none",
                                            fontWeight: "normal",
                                            cursor: "pointer",
                                        }
                                    }
                                    onClick={() => {
                                        setActiveMatches(false);
                                    }}
                                >
                                    ALL TRIPS
                                </span>
                            </Fragment>
                        )) ||
                            "MATCHES"}
                    </h2>
                    <div
                        className="card-container wrapped"
                        id="user-detail-matches"
                    >
                        {activeMatches && (
                            <Matches
                                mode="user"
                                limit={props.match.params.id}
                            />
                        )}
                        {!activeMatches &&
                            trips &&
                            trips
                                .filter(
                                    (elem) =>
                                        elem.person == props.match.params.id &&
                                        Date.now() < new Date(elem.until_max)
                                )
                                .map((elem, i) => (
                                    <div key={i} className="card medium">
                                        <div className="card-image">
                                            <img
                                                src={
                                                    elem.picture ||
                                                    "/default.svg"
                                                }
                                            />
                                        </div>
                                        <div className="card-text">
                                            <h4>
                                                {getLocationName(
                                                    elem.location_id
                                                )}
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
            )}
            <div className="location-right">
                {other && other.confirmed && matches && matches.length > 0 && (
                    <Chat type="user+" user={props.match.params.id} />
                )}
                {other && other.confirmed && matches && !matches.length && (
                    <Chat type="user-" user={props.match.params.id} />
                )}
                {other && !other.confirmed && matches && matches.length > 0 && (
                    <Chat type="trip" user={props.match.params.id} />
                )}
                {other &&
                    !other.confirmed &&
                    (!matches || matches.length == 0) && (
                        <div className="noChat">
                            <h3>chat functionality disabled</h3>
                            <p>
                                it is active for friends and/or in case of a
                                match
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
    const errorBlock = (
        <div className="central user">
            <h4>There was a problem...</h4>
        </div>
    );

    return (other.error && errorBlock) || otherUser;
}

/*
General:
    - view sum of future trips

if friend
    - view full list of future trips
    - chat general with online status
    - chat about all his trips

if not friend:
if match:
    - chat about specific trip but no status about online...
    else:
    - no chat
*/
