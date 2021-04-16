import { useAthenticate, useFormEval } from "../helpers/customHooks";
import { Link } from "react-router-dom";
import { Fragment, useRef, useState } from "react";
import Reset from "./Reset";

export default function Login() {
    const passwordField = useRef();
    const emailField = useRef();
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/welcome/login.json",
        values
    );
    const [resetPage, loadResetPage] = useState(false);
    return (
        <div className="auth-nav-body">
            {(resetPage && <Reset resetPage={loadResetPage} />) || (
                <Fragment>
                    <div className="form-out">
                        <input
                            ref={emailField}
                            onChange={handleChangeEval}
                            type="email"
                            name="email"
                            placeholder="E-Mail"
                            onKeyDown={(e) => {
                                if (e.key == "Enter" && values.email) {
                                    if (values.password) {
                                        handleAuthSubmit();
                                    } else {
                                        passwordField.current.focus();
                                    }
                                } else if (e.key == "Escape") {
                                    values.email = "";
                                    emailField.current.value = "";
                                }
                            }}
                        />
                        <input
                            ref={passwordField}
                            onChange={handleChangeEval}
                            type="password"
                            name="password"
                            placeholder="Password"
                            onKeyDown={(e) => {
                                if (e.key == "Enter" && values.password) {
                                    if (values.email) {
                                        handleAuthSubmit();
                                    } else {
                                        emailField.current.focus();
                                    }
                                } else if (e.key == "Escape") {
                                    values.password = "";
                                    passwordField.current.value = "";
                                }
                            }}
                        />
                        <button
                            className={(status.error && "error-btn") || " "}
                            disabled={
                                !values.email ||
                                !values.password ||
                                status.error ||
                                status.loading
                            }
                            onClick={handleAuthSubmit}
                        >
                            {status.error
                                ? status.error
                                : status.loading
                                ? "Loading"
                                : "Log In"}
                        </button>
                    </div>
                    <div className="welcome-footnote">
                        <p>
                            Forgot your password? Click here to{" "}
                            <b
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    loadResetPage(true);
                                }}
                            >
                                reset
                            </b>
                        </p>
                    </div>
                </Fragment>
            )}
        </div>
    );
}
