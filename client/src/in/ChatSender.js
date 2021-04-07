import { useRef, useState } from "react";
import { emitMessage } from "../helpers/socket";
import { onlineStatus } from "./OnlineStatus";

export default function ChatSender(props) {
    const input = useRef(null);
    const [value, setValue] = useState("");

    const submit = function (e) {
        if (e.key === "Enter" || e.type == "click") {
            e.preventDefault();
            if (props.group == "direct") {
                emitMessage({
                    type: "friend",
                    recipient: props.user,
                    value,
                });
            } else if (props.group[0] == "T") {
                const data = props.group.split("T");
                emitMessage({
                    type: "trip",
                    recipient: data[3],
                    trip_target: data[1],
                    trip_origin: data[2],
                    value,
                });
            } else if (props.location) {
                emitMessage({
                    type: "location",
                    location: props.location,
                    topic: props.group,
                    value,
                });
            }
            input.current.value = "";
            input.current.focus();
        }
        setValue(null);
    };

    return (
        <div className="new-message">
            <div className="msg-input">
                <textarea
                    placeholder={"Your Message..."}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        if (value && value.trim()) {
                            submit(e);
                        }
                    }}
                    ref={input}
                    className="chat-input"
                />
                {props.user && (
                    <p className="subtext">
                        {onlineStatus(props.user)
                            ? "User is online and may respond quickly."
                            : "User is not online and will be informed via e-Mail."}
                    </p>
                )}
            </div>
            <button
                disabled={!value || !value.trim()}
                onClick={(e) => {
                    submit(e);
                }}
            >
                Send Message
            </button>
        </div>
    );
}
