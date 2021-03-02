import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import { getLocationData, toggleUploadModal } from "../helpers/actions";
import Chat from "./Chat";
import PhotoUploader from "./PhotoUploader";

export default function User(props) {
    const dispatch = useDispatch();
    const { location: loc, activateUploadModal } = useSelector(
        (store) => store
    );

    useEffect(async () => {
        dispatch(getLocationData(props.match.params.id));
    }, []);

    if (!loc.name && !loc.error) return null;

    const LocDetails = (
        <div
            className="central location"
            style={{
                backgroundImage: `url(${loc.picture})`,
                backgroundSize: "cover",
            }}
        >
            <Upload />

            {activateUploadModal && (
                <PhotoUploader type="location" id={props.match.params.id} />
            )}
            <h1>{loc.name}</h1>
            <p>
                {loc.country} ({loc.continent})
            </p>
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
