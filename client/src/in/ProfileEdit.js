import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleProfileEdit, updateUserData } from "../helpers/actions";

export default function ProfileEdit() {
    const dispatch = useDispatch();
    const { user, grades, experience } = useSelector((store) => store);
    const [values, setValues] = useState();

    const changeHandler = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="profile data">
            <p>
                <b>Name: </b>
                {user.first} {user.last}
            </p>

            <label>
                <b>Age: </b>
                <input
                    defaultValue={user.age}
                    onChange={changeHandler}
                    type="number"
                    name="age"
                />
            </label>
            <label>
                <b>Grade (comfort): </b>
                <select
                    defaultValue={user.grade_comfort}
                    name="grade_comfort"
                    onChange={changeHandler}
                >
                    {grades.map((element, i) => (
                        <option key={i} value={i}>
                            {element}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                <b>Grade (max): </b>
                <select
                    defaultValue={user.grade_max}
                    name="grade_max"
                    onChange={changeHandler}
                >
                    {grades.map((element, i) => (
                        <option key={i} value={i}>
                            {element}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                <b>Experience: </b>
                <select
                    defaultValue={user.experience}
                    name="experience"
                    onChange={changeHandler}
                >
                    {experience.map((element, i) => (
                        <option key={i} value={i}>
                            {element}
                        </option>
                    ))}
                </select>
            </label>
            <button
                onClick={() => {
                    dispatch(toggleProfileEdit());
                }}
            >
                cancel
            </button>
            <button
                disabled={status.loading}
                onClick={() => {
                    dispatch(updateUserData(values));
                    dispatch(toggleProfileEdit());
                }}
            >
                {status.loading ? "Loading" : "Submit"}
            </button>
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
