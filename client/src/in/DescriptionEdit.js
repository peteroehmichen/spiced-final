import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../helpers/actions";

export default function DescriptionEdit() {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store);
    const [values, setValues] = useState();
    const [descriptionEditMode, setDescriptionEditMode] = useState(false);

    const changeHandler = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Fragment>
            {!descriptionEditMode && (
                <Fragment>
                    <p>
                        <b>About Me:</b>
                    </p>
                    <p>
                        <i>{user.description}</i>
                    </p>
                    <button
                        onClick={() => {
                            setDescriptionEditMode(true);
                        }}
                    >
                        edit
                    </button>
                </Fragment>
            )}
            {descriptionEditMode && (
                <Fragment>
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
                            setDescriptionEditMode(false);
                        }}
                    >
                        cancel
                    </button>
                    <button
                        disabled={!values}
                        onClick={() => {
                            dispatch(updateUserData(values));
                            setDescriptionEditMode(false);
                        }}
                    >
                        Submit
                    </button>
                </Fragment>
            )}
        </Fragment>
    );
}
