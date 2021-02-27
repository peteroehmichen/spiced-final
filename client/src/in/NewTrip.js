import { useDispatch, useSelector } from "react-redux";
import { addNewTrip, toggleTripForm } from "../helpers/actions";
import { useFormEval } from "../helpers/customHooks";

// FIXME Dates can be in wrong order

export default function NewTrip() {
    const { locations } = useSelector((store) => store);
    const [values, handleChangeEval] = useFormEval();

    const dispatch = useDispatch();
    return (
        <div className="form new-trips">
            <h2>please fill out the following core information</h2>
            <label>
                Location
                <select name="location_id" onChange={handleChangeEval}>
                    <option value="" selected></option>
                    {locations &&
                        locations.map((elem) => (
                            <option key={elem.id} value={elem.id}>
                                {elem.name}
                            </option>
                        ))}
                </select>
            </label>
            <label>
                earliest Start
                <input
                    type="date"
                    name="from_min"
                    onChange={handleChangeEval}
                    disabled={!values.location_id}
                />
            </label>
            <label>
                latest End
                <input
                    type="date"
                    name="until_max"
                    onChange={handleChangeEval}
                    disabled={!values.from_min}
                />
            </label>
            <textarea
                name="comment"
                placeholder="Tell others a bit about it"
                disabled={!values.until_max}
                onChange={handleChangeEval}
            />
            <button
                onClick={() => {
                    dispatch(toggleTripForm());
                }}
            >
                cancel
            </button>
            <button
                disabled={!values.until_max}
                onClick={() => {
                    dispatch(addNewTrip(values));
                }}
            >
                save
            </button>
        </div>
    );
}
