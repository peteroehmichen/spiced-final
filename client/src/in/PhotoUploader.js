import axios from "../helpers/axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
    toggleUploadModal,
    toggleTripUploadModal,
    updatePicture,
} from "../helpers/actions";

export default function Uploader(props) {
    const { user, location, trips } = useSelector((store) => store);
    const dispatch = useDispatch();
    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    function selectHandler(e) {
        e.target.labels[0].style.borderBottom = "2px solid orangered";
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

            e.target.labels[0].style.borderBottom = "2px solid green";
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
            picture.append("old", element.picture);
            picture.append("trip_id", props.id);
        } else {
            picture.append("old", user.picture);
        }

        let response = {};
        try {
            const { data } = await axios.post(`/in/picture.json`, picture);
            response = data;
        } catch (err) {
            console.log("error in Upload Post:", err);
            response.error = {
                type: "notifications",
                text: "Server did not respond",
            };
        }
        dispatch(updatePicture(response, props.type, props.id));
        setLoading(false);
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
                    <h2>x</h2>
                </div>
                <h2>Upload a new {props.type} picture</h2>
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
                    <span>{filename || "Click to select an image"}</span>
                </label>
                <button
                    className={(error && "error-btn") || " "}
                    disabled={!file || error || loading}
                    onClick={() => uploadPicture()}
                >
                    {error ? error : loading ? "loading" : "Upload Picture"}
                </button>
            </div>
        </div>
    );
}
