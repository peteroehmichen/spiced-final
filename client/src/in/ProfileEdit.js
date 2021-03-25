import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../helpers/actions";

export default function ProfileEdit() {
    const dispatch = useDispatch();
    const { user, grades, experience } = useSelector((store) => store);
    const [values, setValues] = useState();
    const [profileEditMode, setProfileEditMode] = useState(false);
    const none = "(...please edit..)";

    const changeHandler = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Fragment>
            {grades && experience && !profileEditMode && (
                <Fragment>
                    <p>
                        <b>Name:</b> {user.first} {user.last}
                    </p>
                    <p>
                        <b>Your age:</b> {user.age || none}
                    </p>
                    <p>
                        <b>Your climbing grade:</b>{" "}
                        {user.grade_comfort &&
                            grades[user.grade_comfort] + " (onsight) "}
                        {user.grade_max &&
                            "up to " + grades[user.grade_max] + " (redpoint)"}
                    </p>
                    <p>
                        <b>Experience:</b> {experience[user.experience] || none}
                    </p>
                    <button
                        onClick={() => {
                            setProfileEditMode(true);
                        }}
                    >
                        edit
                    </button>
                </Fragment>
            )}

            {grades && experience && profileEditMode && (
                <Fragment>
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
                            min="18"
                            max="99"
                        />
                    </label>
                    <label>
                        <b>Grade (onsight): </b>
                        <select
                            defaultValue={user.grade_comfort || "default"}
                            name="grade_comfort"
                            onChange={changeHandler}
                        >
                            <option value="default" disabled>
                                choose...
                            </option>
                            {grades.map((element, i) => (
                                <option key={i} value={i}>
                                    {element}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <b>Grade (redpoint): </b>
                        <select
                            defaultValue={user.grade_max || "default"}
                            name="grade_max"
                            onChange={changeHandler}
                        >
                            <option value="default" disabled>
                                choose...
                            </option>
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
                            defaultValue={user.experience || "default"}
                            name="experience"
                            onChange={changeHandler}
                        >
                            <option value="default" disabled>
                                choose...
                            </option>
                            {experience.map((element, i) => (
                                <option key={i} value={i}>
                                    {element}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        onClick={() => {
                            setValues(null);
                            setProfileEditMode(false);
                        }}
                    >
                        cancel
                    </button>
                    <button
                        disabled={!values}
                        onClick={() => {
                            dispatch(updateUserData(values));
                            setProfileEditMode(false);
                        }}
                    >
                        Submit
                    </button>
                </Fragment>
            )}
        </Fragment>
    );
}
