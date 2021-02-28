import { useDispatch, useSelector } from "react-redux";
import { addNewLocation, toggleLocationForm } from "../helpers/actions";
import { useFormEval } from "../helpers/customHooks";

export default function NewLocation() {
    const { countries, continents } = useSelector((store) => store);
    const [values, handleChangeEval] = useFormEval();

    const dispatch = useDispatch();

    if (!countries || !continents) return null;
    // const continents = [];
    // countries.forEach((country) => {
    //     if (!continents.includes(country.Region) && country.Region != "") {
    //         continents.push(country.Region);
    //     }
    // });
    // console.log(continents);
    return (
        <div className="form new-locations">
            <h2>please fill out the following core information</h2>
            <label>
                Continent
                <select
                    name="continent"
                    defaultValue={"DEFAULT"}
                    onChange={handleChangeEval}
                >
                    <option value="DEFAULT" disabled>
                        Choose...
                    </option>
                    {continents.map((elem, i) => (
                        <option key={i} value={elem}>
                            {elem}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Country
                <select
                    defaultValue={"DEFAULT"}
                    name="country"
                    disabled={!values.continent}
                    onChange={handleChangeEval}
                >
                    <option value="DEFAULT" disabled>
                        Choose...
                    </option>
                    {countries
                        .filter((elem) => elem.Region == values.continent)
                        .map((elem, i) => (
                            <option key={i} value={elem.Name}>
                                {elem.Name}
                            </option>
                        ))}
                </select>
            </label>
            <input
                disabled={!values.country}
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
                disabled={!values.name}
                onClick={() => {
                    dispatch(addNewLocation(values));
                }}
            >
                save
            </button>
        </div>
    );
}
