import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import {
    toggleTripForm,
    toggleTripEdit,
    toggleTripStatus,
} from "../helpers/actions";
import { GetLocationName } from "../helpers/helperComponents";
import NewTrip from "./NewTrip";
import TripEdit from "./TripEdit";
import axios from "../helpers/axios";

export default function TripList() {
    const dispatch = useDispatch();
    const { trips, activeTripForm, user, tripEdit } = useSelector(
        (store) => store
    );
    return (
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
                                                        id={elem.location_id}
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
                                                            toggleTripEdit(i)
                                                        );
                                                    }}
                                                >
                                                    edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        dispatch(
                                                            toggleTripStatus(
                                                                elem.id
                                                            )
                                                        );
                                                    }}
                                                >
                                                    {elem.public
                                                        ? "take offline"
                                                        : "publish trip"}
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
    );
}
