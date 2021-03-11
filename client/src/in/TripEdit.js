import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Upload from "../graphComp/Upload";
import { toggleTripEdit, updateTripData } from "../helpers/actions";
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
        setTimeout(() => {
            console.log(values);
        }, 500);
        if (values && values.from_min > newMax) {
            setNewMax(values.from_min);
        }
    };

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };
    return (
        <Fragment>
            <div className="card-left">
                <div className="card-image-edit">
                    <Upload trip={props.trip.id} />
                    <img src={props.trip.picture || "/default.svg"} />
                </div>
                <div className="card-text">
                    <h4>{getLocationName(props.trip.location_id)}</h4>
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
                <div>
                    <button
                        onClick={() => {
                            dispatch(toggleTripEdit(props.index));
                        }}
                    >
                        cancel
                    </button>
                    <button
                        disabled={values && values.from_min > newMax}
                        onClick={() => {
                            if (values) {
                                dispatch(updateTripData(values, props.trip.id));
                            }
                            dispatch(toggleTripEdit(props.index));
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </Fragment>
    );
}
