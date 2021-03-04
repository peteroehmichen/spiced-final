import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Upload from "../graphComp/Upload";
import {
    getTrips,
    toggleTripForm,
    toggleProfileEdit,
    toggleDescriptionEdit,
    toggleTripEdit,
    toggleTripUploadModal,
} from "../helpers/actions";
import DescriptionEdit from "./DescriptionEdit";
import NewTrip from "./NewTrip";
import PhotoUploader from "./PhotoUploader";
import ProfileEdit from "./ProfileEdit";
import TripEdit from "./TripEdit";

export default function Profile() {
    const { activateUploadModal } = useSelector((store) => store);
    const dispatch = useDispatch();
    const {
        trips,
        activeTripForm,
        locations,
        user,
        grades,
        experience,
        profileEdit,
        descriptionEdit,
        tripEdit,
        activateTripUploadModal,
    } = useSelector((store) => store);

    useEffect(() => {
        dispatch(getTrips());
    }, []);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    // if (!user || !trips) return null;
    // console.log(trips);
    return (
        <div className="central prof">
            {activateUploadModal && <PhotoUploader type="profile" />}
            {activateTripUploadModal && (
                <PhotoUploader type="trip" id={activateTripUploadModal} />
            )}
            <h1>Your Public Profile</h1>
            {user && (
                <div className="profile-frame">
                    <div className="profile picture">
                        <Upload />
                        <img src={user.picture || "/default.svg"} />
                    </div>
                    {grades && experience && !profileEdit && (
                        <div className="profile data">
                            <p>
                                <b>Name:</b> {user.first} {user.last}
                            </p>
                            <p>
                                <b>Age:</b> {user.age}
                            </p>
                            <p>
                                <b>Climbing Grade:</b>{" "}
                                {grades[user.grade_comfort]} up to{" "}
                                {grades[user.grade_max]}
                            </p>
                            <p>
                                <b>Experience:</b> {experience[user.experience]}
                            </p>
                            <button
                                onClick={() => {
                                    dispatch(toggleProfileEdit());
                                }}
                            >
                                edit
                            </button>
                        </div>
                    )}
                    {grades && experience && profileEdit && <ProfileEdit />}
                    {!descriptionEdit && (
                        <div className="profile description">
                            <p>
                                <b>Brief Description:</b>
                            </p>
                            <p>{user.description}</p>
                            <button
                                onClick={() => {
                                    dispatch(toggleDescriptionEdit());
                                }}
                            >
                                edit
                            </button>
                        </div>
                    )}
                    {descriptionEdit && <DescriptionEdit />}
                </div>
            )}
            <h1>Your Trips</h1>
            <div className="container-frame">
                <div className="card-container inprofile horizontal">
                    <div className="card medium start wide">
                        {!activeTripForm && (
                            <h1
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    dispatch(toggleTripForm());
                                }}
                            >
                                ✚
                            </h1>
                        )}
                        {activeTripForm && <NewTrip />}
                    </div>
                    {trips &&
                        locations &&
                        user &&
                        trips
                            .filter((trip) => trip.person == user.id)
                            .map((elem, i) => (
                                <div key={i} className="card medium wide split">
                                    <div className="card-left">
                                        <div className="card-image">
                                            <Upload trip={elem.id} />
                                            <img
                                                src={
                                                    elem.picture ||
                                                    "/default.svg"
                                                }
                                            />
                                        </div>
                                        <div className="card-text">
                                            <h4>
                                                {getLocationName(
                                                    elem.location_id
                                                )}
                                            </h4>
                                            <p>
                                                {new Date(
                                                    elem.from_min
                                                ).toLocaleDateString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    elem.until_max
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {!tripEdit[i] && (
                                        <div className="card-right">
                                            <div>
                                                <p>
                                                    <b>Description</b>
                                                </p>
                                                <p>{elem.comment}</p>
                                            </div>
                                            <div className="btn">
                                                <button
                                                    onClick={() => {
                                                        dispatch(
                                                            toggleTripEdit(i)
                                                        );
                                                    }}
                                                >
                                                    edit
                                                </button>
                                                <button>delete</button>
                                            </div>
                                        </div>
                                    )}
                                    {tripEdit[i] && (
                                        <TripEdit trip={elem} index={i} />
                                    )}
                                </div>
                            ))}
                </div>
            </div>
        </div>
    );
}

// <div className="new">

//                 {activeTripForm && <NewTrip />}
//             </div>
