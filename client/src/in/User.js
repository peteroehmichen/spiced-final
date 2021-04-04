import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, removeReduxDetail } from "../helpers/actions";
import FriendButton from "./FriendBtn";
import Matches from "./Matches";
import Chat from "./Chat";
import { GetLocationName } from "../helpers/helperComponents";
import OnlineSymbol from "./OnlineStatus";

export default function User(props) {
    const [activeMatches, setActiveMatches] = useState(true);
    const dispatch = useDispatch();
    const { otherUser: other, grades, experience, trips } = useSelector(
        (store) => store
    );

    useEffect(() => {
        dispatch(getUserData(props.match.params.id));
        return () => {
            dispatch(removeReduxDetail("otherUser", {}));
        };
    }, []);

    const otherUser = (
        <div className="central user">
            {other.id && grades && experience && (
                <div id="user-detail-left">
                    <div id="user-detail-head">
                        <div id="user-detail-image-frame">
                            <img
                                src={other.picture || "/climber.svg"}
                                style={{
                                    objectFit: other.picture
                                        ? "cover"
                                        : "contain",
                                }}
                            />
                            {other.confirmed && <OnlineSymbol id={other.id} />}
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

                            {(other.grade_comfort || other.grade_max) && (
                                <p>
                                    <b>Climbing Grade:</b>
                                    {other.grade_comfort &&
                                        " " +
                                            grades[other.grade_comfort] +
                                            " (onsight)"}
                                    {other.grade_max &&
                                        " up to " +
                                            grades[other.grade_max] +
                                            " (redpoint)"}
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
                                    <i>{other.description}</i>
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
                                                <GetLocationName
                                                    id={elem.location_id}
                                                />
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
            {other.id && (
                <div className="location-right">
                    <Chat type="user+" user={props.match.params.id} />
                </div>
            )}
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
