import { useEffect, useRef, useState } from "react";
import { formatDistance, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages } from "../helpers/actions";
import { emitMessage } from "../helpers/socket";

// FIXME sorting of messages

export default function Chat(props) {
    const chatRef = useRef(null);
    const input = useRef(null);
    const [value, setValue] = useState("");
    const [group, setGroup] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const dispatch = useDispatch();
    let {
        chat: messages,
        otherUser: other,
        matches,
        trips,
        locations,
        user,
        selectedChat,
    } = useSelector((store) => store);

    useEffect(() => {
        messages = null;
        if (props.type == "location") {
            dispatch(receiveChatMessages("location", props.location, 20));
        }
    }, []);

    useEffect(() => {
        if (group == "direct") {
            dispatch(receiveChatMessages("general", props.user, 20));
        } else if (group[0] == "T") {
            dispatch(receiveChatMessages("trip", group, 20));
        }
    }, [group]);

    useEffect(() => {
        if (messages && chatRef.current) {
            chatRef.current.scrollTop =
                chatRef.current.scrollHeight - chatRef.current.clientHeight;
        }
    }, [messages]);

    const submit = function (e) {
        if (e.key === "Enter" || e.type == "click") {
            e.preventDefault();
            if (
                props.type != "location" &&
                (group == "" || group == "direct")
            ) {
                // console.log("sending friend-message...");
                emitMessage({
                    type: "friend",
                    recipient: props.user,
                    value,
                });
            } else if (group[0] == "T") {
                // console.log("sending trip-message...");
                const data = group.split("T");
                emitMessage({
                    type: "trip",
                    recipient: data[3],
                    trip_target: data[1],
                    trip_origin: data[2],
                    value,
                });
            } else if (props.type == "location") {
                // console.log("sending location-message...");
                emitMessage({
                    type: "location",
                    location: props.location,
                    value,
                });
            }
            input.current.value = "";
            input.current.focus();
        }
        setValue(null);
    };
    // console.log("active Users:", activeUsers);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    if (Array.isArray(messages)) {
        // FIXME filter on array for error control
        messages = messages.filter((message) => {
            if (
                !message.trip_origin &&
                !message.trip_target &&
                !message.location_id &&
                group == "direct"
            ) {
                return true;
            } else if (
                group[0] == "T" &&
                group.includes(message.trip_origin) &&
                group.includes(message.trip_target)
            ) {
                return true;
            } else if (
                props.type == "location" &&
                props.location == message.location_id &&
                message.text.includes(searchInput)
            ) {
                return true;
            } else {
                return false;
            }
        });
    }
    let ownMatches = [];
    if (Array.isArray(matches)) {
        ownMatches = matches.filter((elem) => elem.person == other.id);
    }

    return (
        // <h1>Chatis here</h1>
        <div className="chat">
            <div className="target">
                {props.type != "location" && other && matches && (
                    <label>
                        Chat Channel:
                        <select
                            defaultValue={"DEFAULT"}
                            name="tripChat"
                            onChange={(e) => {
                                // console.log(e.target.value);
                                setGroup(e.target.value);
                            }}
                        >
                            <option value="DEFAULT" disabled>
                                Choose...
                            </option>
                            {other.confirmed && (
                                <option value="direct">Direct Message</option>
                            )}
                            {ownMatches.length && (
                                <option disabled>MATCHES</option>
                            )}

                            {ownMatches.map((elem, i) => {
                                return (
                                    <option
                                        key={i}
                                        value={`T${elem.id}T${elem.match_id}T${elem.person}`}
                                    >
                                        {" -  "}
                                        {getLocationName(elem.location_id)} (
                                        {new Date(
                                            elem.from_min
                                        ).toLocaleDateString()}
                                        )
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                )}
                {props.type == "location" && (
                    <input
                        type="text"
                        name="searchContent"
                        placeholder="search through past messages"
                        id="searchContent"
                        key="searchContent"
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            // console.log(e.target.value);
                        }}
                    />
                )}
            </div>
            <div ref={chatRef} className="messages">
                {((!messages || messages.length == 0) && (
                    <div className="messages-no">
                        <p>
                            {(!group && "please select a group") ||
                                "No Messages found"}
                        </p>
                    </div>
                )) ||
                    (Array.isArray(messages) &&
                        messages.map((msg, i) => (
                            <div
                                key={i}
                                className={
                                    msg.first == user.first &&
                                    msg.last == user.last
                                        ? "message-own"
                                        : "message"
                                }
                            >
                                <p className="message-head">
                                    <b>
                                        {msg.first == user.first &&
                                        msg.last == user.last
                                            ? "you"
                                            : msg.first + " " + msg.last}
                                    </b>
                                    ,{"  "}
                                    {formatDistance(
                                        parseISO(msg.created_at),
                                        Date.now()
                                    )}{" "}
                                    ago
                                </p>

                                <p className="message-body">{msg.text}</p>
                            </div>
                        )))}
            </div>
            <div className="new-message">
                <textarea
                    disabled={!group}
                    placeholder="Your Message..."
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) => {
                        if (value) {
                            submit(e);
                        }
                    }}
                    ref={input}
                    className="chat-input"
                />
                <button
                    disabled={!value || !group}
                    onClick={(e) => {
                        submit(e);
                    }}
                >
                    Send Message
                </button>
            </div>
        </div>
    );
}
