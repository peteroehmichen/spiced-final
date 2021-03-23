import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getLocationData,
    addLocationSection,
    removeReduxDetail,
} from "../helpers/actions";

import Upload from "../graphComp/Upload";
import Chat from "./Chat";
import PhotoUploader from "./PhotoUploader";
import LocationRating from "./LocationRating";
import { Loader } from "../helpers/helperComponents";

export default function Location(props) {
    const [newSection, setNewSection] = useState();
    const [values, setValues] = useState();
    const [editing, setEditing] = useState(false);

    const [secEdit, setSecEdit] = useState({});
    const dispatch = useDispatch();
    const { location: loc, activateUploadModal } = useSelector(
        (store) => store
    );

    useEffect(() => {
        dispatch(getLocationData(props.match.params.id));
        return () => {
            dispatch(removeReduxDetail("location"));
        };
    }, []);

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

    let errorBlock;
    if (loc.error) {
        errorBlock = (
            <div className="central location">
                <h4>{loc.error}</h4>
            </div>
        );
    }

    const details = (
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
                {(!loc.name && <Loader />) || (
                    <Fragment>
                        <h1>{loc.name}</h1>
                        <p>
                            {loc.country} ({loc.continent})
                        </p>
                        <LocationRating id={props.match.params.id} />
                    </Fragment>
                )}
            </div>
            <div className="location-body">
                <div className="location-left">
                    <h2>Tips and Trick for Solo Climbers</h2>
                    {!loc.name && !loc.infos && <Loader />}
                    {loc.name && !loc.infos && (
                        <p>be the first to add infos here</p>
                    )}
                    {loc.infos && (
                        <div className="info-block">
                            {infos.map((elem, i) => (
                                <div key={i}>
                                    {!secEdit[i] && (
                                        <div className="infos">
                                            <h3>{elem.title}</h3>
                                            <div className="infos-content">
                                                <p>{elem.content}</p>
                                            </div>
                                            <div>
                                                <button
                                                    disabled={editing}
                                                    onClick={() => {
                                                        setValues({
                                                            title: elem.title,
                                                            content:
                                                                elem.content,
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
                                        </div>
                                    )}
                                    {secEdit[i] && (
                                        <div key={i} className="infos">
                                            <div className="infos-content">
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
                                            </div>
                                            <div>
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
                                        </div>
                                    )}
                                </div>
                            ))}
                            {!newSection && (
                                <div
                                    className="infos add"
                                    onClick={() => {
                                        setEditing(true);
                                        setNewSection(true);
                                        setValues(null);
                                    }}
                                >
                                    ✚
                                </div>
                            )}
                            {newSection && (
                                <div className="infos">
                                    <input
                                        type="text"
                                        placeholder="title of section"
                                        name="title"
                                        onChange={fillNew}
                                    />
                                    <div className="infos-content">
                                        <textarea
                                            placeholder="content"
                                            name="content"
                                            onChange={fillNew}
                                        />
                                    </div>
                                    <div>
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
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="location-right">
                    <h2>Forum</h2>
                    {(!loc.name && <Loader />) || (
                        <Chat
                            type="location"
                            location={props.match.params.id}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return errorBlock || details;
}
