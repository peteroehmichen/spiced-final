import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../helpers/actions";

export default function ProfileEdit() {
    const dispatch = useDispatch();
    const { user, grades, experience } = useSelector((store) => store);
    const [values, setValues] = useState();
    const [profileEditMode, setProfileEditMode] = useState(false);

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
                        <b>Age:</b> {user.age}
                    </p>
                    <p>
                        <b>Climbing Grade:</b> {grades[user.grade_comfort]} up
                        to {grades[user.grade_max]}
                    </p>
                    <p>
                        <b>Experience:</b> {experience[user.experience]}
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
