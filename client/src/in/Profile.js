import { useDispatch, useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import { toggleTripForm, toggleTripEdit } from "../helpers/actions";
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
        tripEdit,
        activateTripUploadModal,
    } = useSelector((store) => store);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    return (
        <div className="central prof">
            {activateUploadModal && <PhotoUploader type="profile" />}
            {activateTripUploadModal && (
                <PhotoUploader type="trip" id={activateTripUploadModal} />
            )}
            {user && (
                <div className="profile-frame">
                    <div className="profile picture">
                        <Upload />
                        <img src={user.picture || "/default.svg"} />
                    </div>
                    <div className="profile data">
                        <ProfileEdit />
                    </div>
                    <div className="profile description">
                        <DescriptionEdit />
                    </div>
                </div>
            )}

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
                        locations &&
                        user &&
                        trips
                            .filter(
                                (trip) =>
                                    trip.person == user.id &&
                                    Date.now() < new Date(trip.until_max)
                            )
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
                                                    <i>{elem.comment}</i>
                                                </p>
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
                                                <button disabled={true}>
                                                    delete
                                                </button>
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
