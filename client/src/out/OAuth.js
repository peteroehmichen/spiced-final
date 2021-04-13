import { useAthenticate, useFormEval } from "../helpers/customHooks";
import { Link } from "react-router-dom";
import axios from "../helpers/axios";
import { useRef } from "react";

export default function OAuth() {
    const passwordField = useRef();
    const emailField = useRef();
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/welcome/oauth.json",
        values
    );
    return (
        <div className="out-main login">
            <div className="title">
                <h3>Please log in with another account</h3>
            </div>
            <div className="form-out">
                <div
                    onClick={() => {
                        console.log("Git called");
                        handleAuthSubmit();
                    }}
                >
                    GITHUB
                </div>
            </div>
            <div className="welcome-footnote">
                <p>
                    Not yet a user? Click here to{" "}
                    <Link to="/register">register</Link>
                </p>
            </div>
        </div>
    );
}
