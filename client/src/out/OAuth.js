import { useAthenticate, useFormEval } from "../helpers/customHooks";
import { Link } from "react-router-dom";
import axios from "../helpers/axios";
import popup from "../helpers/popup";

export default function OAuth() {
    return (
        <div className="out-main login">
            <div className="title">
                <h3>Please log in with another account</h3>
            </div>
            <div className="form-out">
                <div
                    onClick={() => {
                        console.log("Git called");
                        popup(
                            "https://github.com/login/oauth/authorize?client_id=73b6b33f653413cbbff5&scope=read:user,user:email"
                        ).then((access_token) => {
                            console.log(access_token);
                            window.opener.postMessage(
                                { auth: { token: access_token } },
                                window.opener.location
                            );

                            window.opener.postMessage(
                                { error: "Login failed" },
                                window.opener.location
                            );
                        });
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
