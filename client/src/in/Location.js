import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import {
    getLocationData,
    toggleUploadModal,
    addLocationSection,
} from "../helpers/actions";
import Chat from "./Chat";
import PhotoUploader from "./PhotoUploader";
import LocationRating from "./LocationRating";

export default function User(props) {
    const [newSection, setNewSection] = useState();
    const [values, setValues] = useState();
    const [editing, setEditing] = useState(false);

    const [secEdit, setSecEdit] = useState({});
    const dispatch = useDispatch();
    const { location: loc, activateUploadModal } = useSelector(
        (store) => store
    );

    useEffect(async () => {
        dispatch(getLocationData(props.match.params.id));
    }, []);

    if (!loc.name && !loc.error) return null;

    const fillNew = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    let infos;
    if (loc.infos) {
        infos = [];
        let parsedInfos = JSON.parse(loc.infos);
        let arrOfKeys = Object.keys(parsedInfos);
        infos = arrOfKeys.map((elem) => {
            return { title: elem, content: parsedInfos[elem] };
        });
    } else {
        infos = [];
    }
    // console.log(infos);

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
            <div className="location-head">
                <h1>{loc.name}</h1>
                <p>
                    {loc.country} ({loc.continent})
                </p>
                <LocationRating id={props.match.params.id} />
            </div>
            <div className="location-body">
                <div className="location-left">
                    <h2>Useful information</h2>
                    <div className="info-block">
                        {(!loc.infos && <p>no infos yet</p>) ||
                            infos.map((elem, i) => (
                                <div key={i}>
                                    {!secEdit[i] && (
                                        <div className="infos">
                                            <h3>{elem.title}</h3>
                                            <p>{elem.content}</p>
                                            <button
                                                disabled={editing}
                                                onClick={() => {
                                                    setValues({
                                                        title: elem.title,
                                                        content: elem.content,
                                                    });
                                                    setEditing(true);
                                                    setSecEdit({
                                                        ...secEdit,
                                                        [i]: true,
                                                    });
                                                }}
                                            >
                                                edit
                                            </button>
                                        </div>
                                    )}
                                    {secEdit[i] && (
                                        <div key={i} className="infos">
                                            <input
                                                type="text"
                                                name="title"
                                                defaultValue={elem.title}
                                                onChange={fillNew}
                                            />
                                            <textarea
                                                defaultValue={elem.content}
                                                name="content"
                                                onChange={fillNew}
                                            />
                                            <button
                                                onClick={() => {
                                                    setValues(null);
                                                    setEditing(false);
                                                    setSecEdit({
                                                        ...secEdit,
                                                        [i]: false,
                                                    });
                                                }}
                                            >
                                                cancel
                                            </button>
                                            <button
                                                disabled={
                                                    !values ||
                                                    !values.title ||
                                                    !values.content
                                                }
                                                onClick={() => {
                                                    setEditing(false);
                                                    setSecEdit({
                                                        ...secEdit,
                                                        [i]: false,
                                                    });
                                                    dispatch(
                                                        addLocationSection(
                                                            values,
                                                            loc.id,
                                                            {
                                                                title:
                                                                    elem.title,
                                                            }
                                                        )
                                                    );
                                                }}
                                            >
                                                submit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        {!newSection && (
                            <button
                                disabled={editing}
                                onClick={() => {
                                    setEditing(true);
                                    setNewSection(true);
                                    setValues(null);
                                }}
                            >
                                Add new section
                            </button>
                        )}
                        {newSection && (
                            <div className="newSection">
                                <input
                                    type="text"
                                    placeholder="title of section"
                                    name="title"
                                    onChange={fillNew}
                                />
                                <textarea
                                    placeholder="content"
                                    name="content"
                                    onChange={fillNew}
                                />
                                <button
                                    onClick={() => {
                                        setValues(null);
                                        setEditing(false);
                                        setNewSection(false);
                                    }}
                                >
                                    cancel
                                </button>
                                <button
                                    disabled={
                                        !values ||
                                        !values.title ||
                                        !values.content
                                    }
                                    onClick={() => {
                                        setEditing(false);
                                        setNewSection(false);
                                        dispatch(
                                            addLocationSection(
                                                values,
                                                loc.id,
                                                {}
                                            )
                                        );
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="location-right">
                    <h2>Forum</h2>
                    <Chat type="location" location={props.match.params.id} />
                </div>
            </div>
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
