import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDescriptionEdit, updateUserData } from "../helpers/actions";

export default function DescriptionEdit() {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store);
    const [values, setValues] = useState();

    const changeHandler = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="profile description">
            <p>
                <b>Brief Description:</b>
            </p>
            <textarea
                name="description"
                placeholder={"Tell us a bit about you"}
                onChange={changeHandler}
                defaultValue={user.description}
            />
            <button
                onClick={() => {
                    dispatch(toggleDescriptionEdit());
                }}
            >
                cancel
            </button>
            <button
                disabled={status.loading}
                onClick={() => {
                    dispatch(updateUserData(values));
                    dispatch(toggleDescriptionEdit());
                }}
            >
                {status.loading ? "Loading" : "Submit"}
            </button>
        </div>
    );
}
