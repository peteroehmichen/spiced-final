import React, { useState } from "react";
// import { Redirect } from "react-router";
// import { Link, withRouter } from "react-router-dom";
import axios from "../helpers/axios";
import { useFormEval } from "../helpers/customHooks";
import { Link } from "react-router-dom";

export default function Reset() {
    const [step, setStep] = useState(1);
    const [values, handleChangeEval] = useFormEval();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [codeValidUntil, setCodeValidUntil] = useState(0);

    const submitReset = async function () {
        try {
            setLoading(true);
            const result = await axios.post("/welcome/reset.json", {
                email: values.email,
            });
            if (result.data.codeValidUntil) {
                setCodeValidUntil(result.data.codeValidUntil);
                setError(false);
                setLoading(false);
                // console.log("codevalid:", codeValidUntil);
                setStep(2);
            } else {
                setError(result.data.error);
                setTimeout(() => {
                    setError(false);
                }, 3000);
                setLoading(false);
            }
        } catch (err) {
            console.log("Error in POST Reset", err);
            setError("There was a Server Error");
            setTimeout(() => {
                setError(false);
            }, 3000);
            setLoading(false);
        }
    };

    const submitCode = async function () {
        try {
            setLoading(true);
            const result = await axios.post("/welcome/code.json", {
                code: values.code,
                password: values.password,
                email: values.email,
            });
            if (result.data.update == "ok") {
                setError(false);
                setLoading(false);
                setStep(3);
            } else {
                setError(result.data.error);
                setTimeout(() => {
                    setError(false);
                }, 3000);
                setLoading(false);
            }
        } catch (err) {
            console.log("Error in POST Reset", err);
            setLoading(false);
        }
    };

    const toggleRedirect = function () {
        // props.history.push("/login");
        // location.replace("/login");
        console.log("Still to do");
    };

    let renderedStep;
    if (step == 1) {
        renderedStep = (
            <div className="form">
                <input
                    onChange={handleChangeEval}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="E-Mail"
                    key={1}
                />
                <button
                    className={(error && "error-btn") || " "}
                    disabled={!values.email || error || loading}
                    onClick={submitReset}
                >
                    {error ? error : loading ? "Loading" : "Request Code"}
                </button>
            </div>
        );
    } else if (step == 2) {
        renderedStep = (
            <div className="form">
                <h3>
                    Please enter code before{" "}
                    {new Date(codeValidUntil).toTimeString()}
                </h3>
                <input
                    onChange={handleChangeEval}
                    type="text"
                    name="code"
                    id="code"
                    placeholder="Your Reset Code"
                    key={2}
                />
                <input
                    onChange={handleChangeEval}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="New password"
                    key={3}
                />
                <button
                    className={(error && "error-btn") || " "}
                    disabled={
                        !values.code || !values.password || error || loading
                    }
                    onClick={submitCode}
                >
                    {error ? error : loading ? "Loading" : "Send Code"}
                </button>
            </div>
        );
    } else if (step == 3) {
        if (error) {
            renderedStep = (
                <div className="form error">{error && <p>{error}</p>}</div>
            );
        } else {
            renderedStep = (
                <div className="form">
                    <h1>✔︎</h1>
                </div>
            );
        }
    }

    return (
        <div className="reset">
            <div className="title">
                <h3>Reset your password...</h3>
            </div>
            {renderedStep}
            <div className="welcome-footnote">
                <p>
                    Go back to Log In Page. <Link to="/login">click here</Link>
                </p>
            </div>
        </div>
    );
}

// FIXME redirect on large Countdown leeds to memory leak
// TODO nicer redirect after end
// FIXME remove error on change of input
