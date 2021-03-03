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

    // <label>
    //     Location
    //     <select
    //         disabled={true}
    //         defaultValue={props.trip.location_id}
    //         name="location_id"
    //         onChange={changeHandler}
    //     >
    //         {locations &&
    //             locations.map((elem) => (
    //                 <option key={elem.id} value={elem.id}>
    //                     {elem.name}
    //                 </option>
    //             ))}
    //     </select>
    // </label>
    // <label>
    //     Start
    //     <input
    //         disabled={true}
    //         defaultValue={props.trip.from_min}
    //         type="date"
    //         name="from_min"
    //         onChange={changeHandler}
    //     />
    // </label>
    // <label>
    //     End
    //     <input
    //         disabled={true}
    //         defaultValue={props.trip.until_max}
    //         type="date"
    //         name="until_max"
    //         onChange={changeHandler}
    //     />
    // </label>
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
                    disabled={status.loading}
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

/*

        <div className="form">
            <h1>User-Editor</h1>
            
            <textarea
                name="description"
                placeholder="Tell us a bit about you."
                onChange={changeHandler}
            />
            
        </div>

*/
