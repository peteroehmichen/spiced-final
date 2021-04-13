import { useAthenticate, useFormEval } from "../helpers/customHooks";
import { Link } from "react-router-dom";
import axios from "../helpers/axios";
import { useRef } from "react";

export default function Login() {
    const passwordField = useRef();
    const emailField = useRef();
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/welcome/login.json",
        values
    );
    return (
        <div className="out-main login">
            <div className="title">
                <h3>Please log in with your email address</h3>
            </div>
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
                    Not yet a user? Click here to{" "}
                    <Link to="/register">register</Link>
                </p>
                <p>
                    Forgot your password? Click here to{" "}
                    <Link to="/reset">reset</Link>
                </p>
                <p>
                    temporary Link to OAUTH with <Link to="/oauth">GitHub</Link>
                </p>
                <i style={{ color: "rgb(53 53 53)" }}>
                    Or log in with a predefined test user{" "}
                    <b
                        style={{ cursor: "pointer" }}
                        onClick={async () => {
                            const { data } = await axios.post(
                                "/welcome/login.json",
                                {
                                    email: "test@example.com",
                                    password: "test",
                                }
                            );
                            if (data.status == "OK") {
                                location.replace("/");
                            }
                        }}
                    >
                        click here
                    </b>
                </i>
            </div>
        </div>
    );
}
