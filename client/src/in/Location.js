import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLocationData } from "../helpers/actions";
import Chat from "./Chat";

export default function User(props) {
    const dispatch = useDispatch();
    const loc = useSelector((store) => store.location);

    useEffect(async () => {
        dispatch(getLocationData(props.match.params.id));
    }, []);

    if (!loc.name && !loc.error) return null;

    const LocDetails = (
        <div className="central location">
            <h1>
                {loc.name} {loc.name}
            </h1>
            <p>...</p>
            <Chat type="location" location={props.match.params.id} />
        </div>
    );
    const errorBlock = (
        <div className="central location">
            <h4>There was a problem...</h4>
            <h4>{loc.error}</h4>
        </div>
    );

    return (loc.error && errorBlock) || LocDetails;
}
