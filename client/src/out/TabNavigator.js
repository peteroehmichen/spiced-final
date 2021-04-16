import { useState } from "react";
import axios from "../helpers/axios";

export default function TabNavigator(props) {
    const [activeTab, setActiveTab] = useState(props.children[0].props.label);
    const select = (e) => {
        setActiveTab(e.target.innerText);
    };

    return (
        <div className="auth-nav-frame">
            <div className="tab-list">
                {props.children.map((tab, i) => {
                    return (
                        <div
                            className={`tab-list-item ${
                                activeTab === tab.props.label
                                    ? "tab-list-active"
                                    : ""
                            }`}
                            key={i}
                            onClick={select}
                        >
                            {tab.props.label}
                        </div>
                    );
                })}
            </div>
            {props.children.find((tab) => tab.props.label === activeTab)}
            <div>
                <i style={{ color: "rgb(53 53 53)" }}>
                    Or log in with a predefined test user?{" "}
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
                        Click here
                    </b>
                </i>
            </div>
        </div>
    );
}
