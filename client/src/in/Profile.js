import { Fragment } from "react";
import { useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import { Loader } from "../helpers/helperComponents";
import DescriptionEdit from "./DescriptionEdit";
import PhotoUploader from "./PhotoUploader";
import ProfileEdit from "./ProfileEdit";
import TripList from "./TripList";

export default function Profile() {
    const { activateUploadModal } = useSelector((store) => store);
    const { user, activateTripUploadModal } = useSelector((store) => store);
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
            <TripList />
        </div>
    );
}
