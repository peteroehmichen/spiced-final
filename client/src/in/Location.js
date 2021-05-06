import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLocationData, removeReduxDetail } from "../helpers/actions";

import Upload from "../graphComp/Upload";
import Chat from "./Chat";
import PhotoUploader from "./PhotoUploader";
import LocationRating from "./LocationRating";
import { Loader } from "../helpers/helperComponents";
import LocationTips from "./LocationTips";

export default function Location(props) {
    const dispatch = useDispatch();

    const { location, activateUploadModal } = useSelector(
        (store) => store
    );

    useEffect(() => {
        dispatch(getLocationData(props.match.params.id));
        return () => {
            dispatch(removeReduxDetail("location", {}));
        };
    }, []);

    let errorBlock;
    if (location.error) {
        errorBlock = (
            <div className="central location">
                <h4>{location.error}</h4>
            </div>
        );
    }

    return (
        errorBlock || (
            <div
                className="central location"
                style={{
                    backgroundImage: `url(${location.picture})`,
                    backgroundSize: "cover",
                }}
            >
                <Upload />
                {activateUploadModal && (
                    <PhotoUploader type="location" id={props.match.params.id} />
                )}
                <div className="location-head">
                    {(!location.name && <Loader />) || (
                        <Fragment>
                            <h1>{location.name}</h1>
                            <p>
                                {location.country} ({location.continent})
                            </p>
                            <LocationRating id={props.match.params.id} />
                        </Fragment>
                    )}
                </div>
                <div className="location-body">
                    <div className="location-left">
                        <h2>Tips and Trick for Solo Climbers</h2>
                        <LocationTips />
                    </div>
                    <div className="location-right">
                        <h2>Forum</h2>
                        {(!location.name && <Loader />) || (
                            <Chat
                                type="location"
                                location={props.match.params.id}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    );
}
