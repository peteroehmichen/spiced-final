import axios from "../helpers/axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
    updateLocationPicture,
    updateProfilePicture,
    updateTripPicture,
    toggleUploadModal,
    toggleTripUploadModal,
} from "../helpers/actions";

export default function Uploader(props) {
    const { user, location, trips } = useSelector((store) => store);
    const dispatch = useDispatch();
    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    function selectHandler(e) {
        e.target.labels[0].style.borderBottom = "3px solid orangered";
        if (e.target.files.length < 1) {
            setFile("");
            setFilename("");
            setError("");
        } else if (e.target.files[0].size > 2097152) {
            setFile("");
            setFilename("max. 2 MB");
            setError("File Size too large");
        } else {
            let shortened = e.target.files[0].name;
            shortened =
                shortened.length > 18
                    ? shortened.slice(0, 18) + "..."
                    : shortened;
            setFile(e.target.files[0]);
            setFilename(shortened);
            setError("");

            e.target.labels[0].style.borderBottom = "3px solid green";
        }
    }

    async function uploadPicture() {
        setLoading(true);

        const picture = new FormData();
        picture.append("file", file);
        if (props.type == "location") {
            picture.append("old", location.picture);
            picture.append("location_id", props.id);
        } else if (props.type == "trip") {
            let element = trips.filter((elem) => elem.id == props.id);
            console.log("found old picture:", element);
            picture.append("old", element.picture);
            picture.append("trip_id", props.id);
        } else {
            picture.append("old", user.picture);
        }

        const response = {};
        try {
            const { data } = await axios.post(`/in/picture.json`, picture);
            if (!data.error) {
                response.url = data.url;
            } else {
                response.error = data.error;
                setError(data.error);
            }
        } catch (err) {
            console.log("error in Upload Post:", err);
            response.error = "unknown server error";
            setError("unknown server error");
        }
        if (props.type == "location") {
            dispatch(updateLocationPicture(response));
        } else if (props.type == "trip") {
            dispatch(updateTripPicture(response, props.id));
        } else {
            dispatch(updateProfilePicture(response));
        }
        setLoading(false);
        if (props.type == "trip") {
            dispatch(toggleTripUploadModal(false));
        } else {
            dispatch(toggleUploadModal());
        }
    }

    return (
        <div className="overlay">
            <div className="uploader">
                <div
                    className="close"
                    onClick={() => {
                        if (props.type == "trip") {
                            dispatch(toggleTripUploadModal(false));
                        } else {
                            dispatch(toggleUploadModal());
                        }
                    }}
                >
                    X
                </div>
                <div className="uploader-body">
                    <div className="pane two">
                        <h2>
                            Upload a new {props.type} picture{" "}
                            {props.type == "trip" ? `for id ${props.id}` : " "}
                        </h2>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            accept="image/*"
                            onChange={selectHandler}
                            key={4}
                        />
                        <label htmlFor="file">
                            <img src="/upload_black.svg" />
                            <span>{filename || "Please select an image"}</span>
                        </label>
                        <button
                            className={(error && "error-btn") || " "}
                            disabled={!file || error || loading}
                            onClick={() => uploadPicture()}
                        >
                            {error
                                ? error
                                : loading
                                ? "loading"
                                : "Upload Picture"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
