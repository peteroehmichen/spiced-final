import { useDispatch } from "react-redux";
import { addNewLocation, toggleLocationForm } from "../helpers/actions";
import { useFormEval } from "../helpers/customHooks";

export default function NewLocation() {
    const [values, handleChangeEval] = useFormEval();

    const dispatch = useDispatch();
    return (
        <div className="form new-locations">
            <h2>please fill out the following core information</h2>
            <label>
                Continent
                <select name="continent" onChange={handleChangeEval}>
                    <option value="1">Africa</option>
                    <option value="2">Antarctica</option>
                    <option value="3">Asia</option>
                    <option value="4">Australia</option>
                    <option value="5">Europe</option>
                    <option value="6">North America</option>
                    <option value="7">South America</option>
                </select>
            </label>
            <label>
                Country
                <select name="country" onChange={handleChangeEval}>
                    <option value="1">France</option>
                    <option value="2">Germany</option>
                    <option value="3">Greece</option>
                    <option value="4">Italy</option>
                    <option value="5">Mexico</option>
                    <option value="6">USA</option>
                </select>
            </label>
            <input
                type="text"
                name="name"
                placeholder="Crag / Site"
                onChange={handleChangeEval}
            />

            <button
                onClick={() => {
                    dispatch(toggleLocationForm());
                }}
            >
                cancel
            </button>
            <button
                onClick={() => {
                    dispatch(addNewLocation(values));
                }}
            >
                save
            </button>
        </div>
    );
}
