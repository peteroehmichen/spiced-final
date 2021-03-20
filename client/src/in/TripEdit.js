import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import { deleteTrip, toggleTripEdit, updateTripData } from "../helpers/actions";
import { formatISO } from "date-fns";
// FIXME import DatePicker from "react-datepicker";

export default function TripEdit(props) {
    const dispatch = useDispatch();
    const { locations } = useSelector((store) => store);
    const [values, setValues] = useState();
    const [newMax, setNewMax] = useState(props.trip.until_max);

    const changeHandler = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
        if (values && values.from_min > newMax) {
            setNewMax(values.from_min);
        }
    };

    // let sortedLocations;
    // if (Array.isArray(locations)) {
    // sortedLocations = locations.sort((e1, e2) =>
    //     e1.name.toLowerCase().localeCompare(e2.name.toLowerCase())
    // );
    // }
    // FIXME major bug in toast while changing trip destination in offline mode.
    return (
        <Fragment>
            <div className="card-left">
                <div className="card-text">
                    <select
                        defaultValue={props.trip.location_id}
                        name="location_id"
                        onChange={changeHandler}
                    >
                        {locations &&
                            [...locations]
                                .sort((e1, e2) =>
                                    e1.name
                                        .toLowerCase()
                                        .localeCompare(e2.name.toLowerCase())
                                )
                                .map((elem) => (
                                    <option key={elem.id} value={elem.id}>
                                        {elem.name.length > 16
                                            ? elem.name.slice(0, 14) + "..."
                                            : elem.name}
                                    </option>
                                ))}
                    </select>
                    <input
                        type="date"
                        name="from_min"
                        defaultValue={formatISO(new Date(props.trip.from_min), {
                            representation: "date",
                        })}
                        onChange={changeHandler}
                    />
                    <input
                        type="date"
                        name="until_max"
                        min={formatISO(
                            new Date(
                                (values && values.from_min) ||
                                    props.trip.from_min
                            ),
                            {
                                representation: "date",
                            }
                        )}
                        defaultValue={formatISO(new Date(newMax), {
                            representation: "date",
                        })}
                        onChange={changeHandler}
                    />
                </div>
                <div>
                    <button
                        onClick={() => {
                            dispatch(toggleTripEdit(props.index));
                        }}
                    >
                        cancel
                    </button>
                    <button
                        disabled={!values || values.from_min > newMax}
                        onClick={() => {
                            if (values) {
                                dispatch(
                                    updateTripData(
                                        values,
                                        props.trip.id,
                                        props.index
                                    )
                                );
                            }
                        }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => {
                            dispatch(toggleTripEdit(props.index));
                            dispatch(deleteTrip(props.trip.id));
                        }}
                    >
                        delete Trip
                    </button>
                </div>
            </div>
            <div className="card-right">
                <p>
                    <b>Brief Description:</b>
                </p>
                <textarea
                    name="comment"
                    placeholder={"briefly describe your trip details"}
                    onChange={changeHandler}
                    defaultValue={props.trip.comment}
                />
            </div>
        </Fragment>
    );
}
