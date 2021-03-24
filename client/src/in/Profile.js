import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import { toggleTripForm, toggleTripEdit } from "../helpers/actions";
import { GetLocationName, Loader } from "../helpers/helperComponents";
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
        user,
        tripEdit,
        activateTripUploadModal,
    } = useSelector((store) => store);
    return (
        <div className="central prof">
            {activateUploadModal && user && (
                <PhotoUploader type="profile" id={user.id} />
            )}
            {activateTripUploadModal && (
                <PhotoUploader type="trip" id={activateTripUploadModal} />
            )}
            <div className="profile-frame">
                {!user ? (
                    <Loader />
                ) : (
                    <Fragment>
                        <div className="profile picture">
                            <Upload />
                            <img
                                src={user.picture || "/climber.svg"}
                                style={{
                                    objectFit: user.picture
                                        ? "cover"
                                        : "contain",
                                    color: "black",
                                    objectPosition: "center top",
                                }}
                            />
                        </div>
                        <div className="profile data">
                            <ProfileEdit />
                        </div>
                        <div className="profile description">
                            <DescriptionEdit />
                        </div>
                    </Fragment>
                )}
            </div>

            <h1>Your current and upcomming trips</h1>
            <div className="container-frame">
                <div className="card-container inprofile horizontal">
                    {!activeTripForm && (
                        <div
                            className="card medium start"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                dispatch(toggleTripForm());
                            }}
                        >
                            <h1>✚</h1>
                        </div>
                    )}
                    {activeTripForm && (
                        <div className="card medium start">
                            <NewTrip />
                        </div>
                    )}
                    {trips &&
                        user &&
                        trips
                            .filter(
                                (trip) =>
                                    trip.person == user.id &&
                                    Date.now() < new Date(trip.until_max)
                            )
                            .map((elem, i) => (
                                <div key={i} className="card medium wide split">
                                    {!tripEdit[i] && (
                                        <Fragment>
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
                                                        <GetLocationName
                                                            id={
                                                                elem.location_id
                                                            }
                                                        />
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
                                            <div className="card-right">
                                                <div>
                                                    <p>
                                                        <i>{elem.comment}</i>
                                                    </p>
                                                </div>
                                                <div className="btn">
                                                    <button
                                                        onClick={() => {
                                                            dispatch(
                                                                toggleTripEdit(
                                                                    i
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        edit
                                                    </button>
                                                </div>
                                            </div>
                                        </Fragment>
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
