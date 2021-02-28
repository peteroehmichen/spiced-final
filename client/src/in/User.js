import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistance, parseISO } from "date-fns";
import { getUserData } from "../helpers/actions";
import FriendButton from "./FriendBtn";
import Matches from "./Matches";
import Chat from "./Chat";

export default function User(props) {
    const dispatch = useDispatch();
    const { otherUser: other, grades, experience, matches } = useSelector(
        (store) => store
    );

    useEffect(async () => {
        dispatch(getUserData(props.match.params.id));
    }, []);

    if (!other.first && !other.error) return null;

    const otherUser = (
        <div className="central user">
            {other && grades && experience && (
                <div>
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
                            <b>Climbing Grade:</b> {grades[other.grade_comfort]}{" "}
                            up to {grades[other.grade_max]}
                        </p>
                    )}
                    {other.experience && (
                        <p>
                            <b>Experience:</b> {experience[other.experience]}
                        </p>
                    )}
                    {other.description && (
                        <p>
                            <b>Description:</b> {other.description}
                        </p>
                    )}
                    {other.confirmed && (
                        <p>
                            <b>Friends with me:</b> YES
                        </p>
                    )}
                    {other.last_online && (
                        <p>
                            <b>Last Time Online: </b>
                            {formatDistance(
                                parseISO(other.last_online),
                                Date.now()
                            )}{" "}
                            ago
                        </p>
                    )}
                    <p className="todo">sum of trips in future</p>
                    <FriendButton friendId={props.match.params.id} />
                    <Matches limit={props.match.params.id} />
                </div>
            )}
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
