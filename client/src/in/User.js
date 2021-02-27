import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../helpers/actions";
import FriendButton from "./FriendBtn";

export default function User(props) {
    const dispatch = useDispatch();
    const other = useSelector((store) => store.otherUser);

    useEffect(async () => {
        dispatch(getUserData(props.match.params.id));
    }, []);

    if (!other.first && !other.error) return null;

    const otherUser = (
        <div className="central user">
            <h1>
                {other.first} {other.last}
            </h1>
            <p>...</p>
            <FriendButton friendId={props.match.params.id} />
        </div>
    );
    const errorBlock = (
        <div className="central user">
            <h4>There was a problem...</h4>
        </div>
    );

    return (other.error && errorBlock) || otherUser;
}
