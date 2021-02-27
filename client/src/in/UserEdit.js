import { formatDistance, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateUserData } from "../helpers/actions";
import UserEdit from "./UserEdit";

export default function userEdit() {
    const grades = [
        "1",
        "2",
        "3",
        "4a",
        "4b",
        "4c",
        "5a",
        "5b",
        "5c",
        "6a",
        "6a+",
        "6b",
        "6b+",
        "6c",
        "6c+",
        "7a",
        "7a+",
        "7b",
        "7b+",
        "7c",
        "7c+",
        "8a",
        "8a+",
        "8b",
        "8b+",
        "8c",
        "8c+",
        "9a",
        "9a+",
        "9b",
        "9b+",
        "9c",
    ];

    const comfort = useRef();
    const max = useRef();
    const dispatch = useDispatch();

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({});

    const changeHandler = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="form">
            <h1>User-Editor</h1>
            <label>
                Age
                <input onChange={changeHandler} type="number" name="age" />
            </label>
            <label>
                Your Home Location
                <input onChange={changeHandler} type="text" name="location" />
            </label>
            <label>
                Climbing Grade Comfort
                <select
                    ref={comfort}
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
                Climbing Grade Max
                <select ref={max} name="grade_max" onChange={changeHandler}>
                    {grades.map((element, i) => (
                        <option key={i} value={i}>
                            {element}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Experience
                <select name="experience" onChange={changeHandler}>
                    <option value="0">0-1 year</option>
                    <option value="1">2-3 years</option>
                    <option value="2">3-5 years</option>
                    <option value="3">5-9 years</option>
                    <option value="4">10+ years</option>
                </select>
            </label>
            <textarea
                name="description"
                placeholder="Tell us a bit about you."
                onChange={changeHandler}
            />
            <button
                className={(status.error && "error-btn") || " "}
                disabled={status.error || status.loading}
                onClick={() => {
                    dispatch(updateUserData(values));
                }}
            >
                {status.error
                    ? status.error
                    : status.loading
                    ? "Loading"
                    : "Submit"}
            </button>
        </div>
    );
}
