import { useAthenticate, useFormEval } from "../helpers/customHooks";

export default function Register() {
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/welcome/register.json",
        values
    );

    return (
        <div className="register">
            <div className="title">
                <h3>Please sign up with your personal information</h3>
            </div>
            <div className="form">
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
                    placeholder="password"
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
        </div>
    );
}
