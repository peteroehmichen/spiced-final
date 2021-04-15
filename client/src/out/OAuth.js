import { Link } from "react-router-dom";
import axios from "../helpers/axios";
import popup from "../helpers/popup";
import toast from "react-hot-toast";

export default function OAuth() {
    const GITHUB_ID =
        process.env.NODE_ENV === "production"
            ? "3cf739fc10dc7f8ef5dd"
            : "73b6b33f653413cbbff5";
    return (
        <div className="out-main login">
            <div className="title">
                <h3>Please log in with your GitHub account</h3>
            </div>
            <div className="form-out">
                <img
                    src="/GitHub-Mark-64px.png"
                    className="oauth-logo"
                    onClick={() => {
                        toast
                            .promise(
                                popup(
                                    `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&scope=read:user,user:email`,
                                    "githubPopup"
                                ),
                                {
                                    loading:
                                        "Authentication with GitHub in progress",
                                    success: "Response from GitHub received",
                                    error:
                                        "Error while authentication with GitHub",
                                }
                            )
                            .then((data) => {
                                if (data.code) {
                                    return data.code;
                                } else {
                                    toast.error(data.error || "Unknown Error");
                                    throw new Error("exit Promise Chain");
                                }
                            })
                            .then(async (code) => {
                                try {
                                    const { data } = await axios.get(
                                        `/welcome/oauth?provider=GitHub&code=${code}`
                                    );
                                    console.log("data from process:", data);
                                    // Continue here with respon
                                    if (data.status == "OK") {
                                        location.replace("/");
                                    } else if (data.error) {
                                        console.log("Error:", data.error);
                                        toast.error(data.error);
                                    }
                                } catch (err) {
                                    console.log("error:", err);
                                }
                            })
                            .catch((err) => {
                                console.log("error received:", err);
                            });
                    }}
                />
            </div>
            <div className="welcome-footnote">
                <p>
                    Not yet a user? Click here to{" "}
                    <Link to="/register">register</Link>
                </p>
                <p>
                    Already a local user? Click here to{" "}
                    <Link to="/login">log in</Link>
                </p>
            </div>
        </div>
    );
}
