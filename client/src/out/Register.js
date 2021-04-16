import { useRef } from "react";
import { useAthenticate, useFormEval } from "../helpers/customHooks";

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/welcome/register.json",
        values
    );

    return (
        <div className="auth-nav-body">
            <div className="form-out">
                <input
                    ref={username}
                    onChange={handleChangeEval}
                    type="text"
                    name="username"
                    placeholder="Your name"
                    onKeyDown={(e) => {
                        if (e.key == "Enter" && values.username) {
                            email.current.focus();
                        } else if (e.key == "Escape") {
                            values.username = "";
                            username.current.value = "";
                        }
                    }}
                />
                <input
                    ref={email}
                    onChange={handleChangeEval}
                    type="email"
                    name="email"
                    placeholder="E-Mail"
                    onKeyDown={(e) => {
                        if (e.key == "Enter" && values.email) {
                            password.current.focus();
                        } else if (e.key == "Escape") {
                            values.email = "";
                            email.current.value = "";
                        }
                    }}
                />
                <input
                    ref={password}
                    onChange={handleChangeEval}
                    type="password"
                    name="password"
                    placeholder="Password"
                    onKeyDown={(e) => {
                        if (e.key == "Enter" && values.password) {
                            if (values.username && values.email) {
                                handleAuthSubmit();
                            } else {
                                username.current.focus();
                            }
                        } else if (e.key == "Escape") {
                            values.password = "";
                            password.current.value = "";
                        }
                    }}
                />
                <button
                    className={(status.error && "error-btn") || " "}
                    disabled={
                        !values.username ||
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
                        : "Register"}
                </button>
            </div>
        </div>
    );
}
