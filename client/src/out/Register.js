import { Link } from "react-router-dom";
import { useAthenticate, useFormEval } from "../helpers/customHooks";

export default function Register() {
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/welcome/register.json",
        values
    );

    return (
        <div className="out-main register">
            <div className="title">
                <h3>Please sign up with your personal information</h3>
            </div>
            <div className="form-out">
                <input
                    onChange={handleChangeEval}
                    type="text"
                    name="first"
                    placeholder="First name"
                />
                <input
                    onChange={handleChangeEval}
                    type="text"
                    name="last"
                    placeholder="Last name"
                />
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
                        !values.first ||
                        !values.last ||
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
            <div className="welcome-footnote">
                <p>
                    Already a user? Click here to{" "}
                    <Link to="/login">log in</Link>
                </p>
            </div>
        </div>
    );
}
