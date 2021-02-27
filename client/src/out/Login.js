import { useAthenticate, useFormEval } from "../helpers/customHooks";

export default function Login() {
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/welcome/login.json",
        values
    );
    return (
        <div className="login">
            <div className="title">
                <h3>please log in with your email address</h3>
            </div>
            <div className="form">
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
                    placeholder="password"
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
        </div>
    );
}
