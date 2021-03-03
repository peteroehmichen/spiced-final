import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistance, parseISO } from "date-fns";
import { getTrips, getUserData } from "../helpers/actions";
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
    } = useSelector((store) => store);

    useEffect(async () => {
        dispatch(getUserData(props.match.params.id));
        // dispatch(getTrips());
    }, []);

    if (!other.first && !other.error) return null;

    let allTrips;
    // if (Array.isArray(trips)) {
    //     allTrips = trips
    //         .filter((elem) => elem.person == props.params.id)
    //         .map((elem) => <h1>found a trip</h1>);
    // }

    const otherUser = (
        <div className="central user">
            {other && grades && experience && (
                <div className="location-left">
                    <div className="user-infos">
                        <div className="user-image">
                            <img src={other.picture || "/default.svg"} />
                        </div>
                        <div className="user-description">
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
                            <p className="todo">
                                sum of trips in future # of Friends snd
                                friendbtn
                            </p>
                            <FriendButton friendId={props.match.params.id} />
                        </div>
                    </div>
                    <h1>
                        <span
                            onClick={() => {
                                setActiveMatches(true);
                            }}
                        >
                            Matches
                        </span>{" "}
                        <span
                            onClick={() => {
                                setActiveMatches(false);
                            }}
                        ></span>
                    </h1>
                    <div className="card-container wrapped">
                        {activeMatches && (
                            <Matches
                                mode="user"
                                limit={props.match.params.id}
                            />
                        )}
                        {!activeMatches && allTrips}
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
