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
            <div>
                <h2>Add a new crag</h2>
            </div>
            <div>
                <label>
                    <select
                        name="continent"
                        defaultValue={"DEFAULT"}
                        onChange={handleChangeEval}
                    >
                        <option value="DEFAULT" disabled>
                            Continent
                        </option>
                        {continents.map((elem, i) => (
                            <option key={i} value={elem}>
                                {elem.length > 20
                                    ? elem.slice(0, 17) + "..."
                                    : elem}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <select
                        defaultValue={"DEFAULT"}
                        name="country"
                        disabled={!values.continent}
                        onChange={handleChangeEval}
                    >
                        <option value="DEFAULT" disabled>
                            Country
                        </option>
                        {countries
                            .filter((elem) => elem.Region == values.continent)
                            .map((elem, i) => (
                                <option key={i} value={elem.Name}>
                                    {elem.Name.length > 20
                                        ? elem.Name.slice(0, 17) + "..."
                                        : elem.Name}
                                </option>
                            ))}
                    </select>
                </label>
                <input
                    disabled={!values.country}
                    type="text"
                    name="name"
                    placeholder="Name of the Crag"
                    onChange={handleChangeEval}
                />
            </div>
            <div>
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
        </div>
    );
}
