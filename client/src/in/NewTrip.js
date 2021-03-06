import { useDispatch, useSelector } from "react-redux";
import { addNewTrip, toggleTripForm } from "../helpers/actions";
import { useFormEval } from "../helpers/customHooks";
import { formatISO } from "date-fns";

export default function NewTrip() {
    const { locations } = useSelector((store) => store);
    const [values, handleChangeEval] = useFormEval();

    const dispatch = useDispatch();
    return (
        <div className="form new-trips">
            <div>
                <h2>Basic information</h2>
            </div>
            <div>
                <label>
                    Crag
                    <select
                        defaultValue={"DEFAULT"}
                        name="location_id"
                        onChange={handleChangeEval}
                    >
                        <option value="DEFAULT" disabled>
                            Choose...
                        </option>
                        {locations &&
                            locations
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
                </label>
                <label>
                    Start
                    <input
                        type="date"
                        name="from_min"
                        min={formatISO(new Date(), { representation: "date" })}
                        onChange={handleChangeEval}
                        disabled={!values.location_id}
                    />
                </label>
                <label>
                    End
                    <input
                        type="date"
                        name="until_max"
                        defaultValue={values.from_min}
                        min={values.from_min}
                        onChange={handleChangeEval}
                        disabled={!values.from_min}
                    />
                </label>
            </div>

            <div>
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
        </div>
    );
}
