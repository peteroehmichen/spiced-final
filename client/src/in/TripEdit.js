import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTripEdit, updateTripData } from "../helpers/actions";

export default function TripEdit(props) {
    const dispatch = useDispatch();
    const { locations } = useSelector((store) => store);
    const [values, setValues] = useState();

    const changeHandler = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return (
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
    );
}
