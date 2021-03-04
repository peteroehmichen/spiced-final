import { useAthenticate, useFormEval } from "../helpers/customHooks";
import { Link } from "react-router-dom";

export default function Login() {
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
                    onChange={handleChangeEval}
                    type="email"
                    name="email"
                    placeholder="E-Mail"
                />
                <input
                    onChange={handleChangeEval}
                    type="password"
                    name="password"
                    placeholder="Password"
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
            </div>
        </div>
    );
}
