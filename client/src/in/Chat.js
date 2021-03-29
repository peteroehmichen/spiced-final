import { useEffect, useRef, useState } from "react";
import { formatDistance, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages, removeReduxDetail } from "../helpers/actions";
import { emitMessage } from "../helpers/socket";

// FIXME sorting of messages
// FIXME clear search input before sending msg

/*

<div className="noChat">
                            <h3>chat functionality disabled</h3>
                            <p>
                                it is active for friends and/or in case of a
                                match
                            </p>
                        </div>

*/
export default function Chat(props) {
    const chatRef = useRef(null);
    const input = useRef(null);
    const [value, setValue] = useState("");
    const [group, setGroup] = useState();
    const [searchInput, setSearchInput] = useState("");

    const dispatch = useDispatch();
    let {
        chat,
        otherUser: other,
        matches,
        user,
        location_topics,
    } = useSelector((store) => store);

    useEffect(() => {
        return () => {
            dispatch(removeReduxDetail("chat", null));
        };
    }, []);

    useEffect(() => {
        if (group) {
            if (group == "Direct") {
                dispatch(receiveChatMessages("direct", props.user, 100));
            } else if (group[0] == "T") {
                dispatch(receiveChatMessages("trip", group, 100));
            } else if (props.location) {
                dispatch(receiveChatMessages("location", props.location, 100));
            }
        }
    }, [group]);

    useEffect(() => {
        if (chat && chatRef.current) {
            chatRef.current.scrollTop =
                chatRef.current.scrollHeight - chatRef.current.clientHeight;
        }
    }, [chat]);

    const submit = function (e) {
        if (e.key === "Enter" || e.type == "click") {
            e.preventDefault();
            if (!props.location && (group == "" || group == "direct")) {
                emitMessage({
                    type: "friend",
                    recipient: props.user,
                    value,
                });
            } else if (group[0] == "T") {
                const data = group.split("T");
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
                    topic: group,
                    value,
                });
            }
            input.current.value = "";
            input.current.focus();
        }
        setValue(null);
    };

    let directMatches = [];
    if (Array.isArray(matches)) {
        directMatches = matches.filter((elem) => elem.person == other.id);
    }

    if (Array.isArray(chat)) {
        if (props.location) {
            // console.log("filtering for:", group);
            chat = chat.filter((m) => {
                if (m.location_id != props.location) return false;
                if (m.location_topic === group) {
                    // console.log(m.location_topic, "pass");
                    return true;
                } else {
                    if (group === "General" && !m.location_topic) {
                        // console.log(m.location_topic, "pass");
                        return true;
                    }
                    // console.log(m.location_topic, "fail");
                    return false;
                }
            });
        }
        if (props.user && other) {
            chat = chat.filter((m) => {
                if (group == "Direct") {
                    if (!m.trip_origin && !m.trip_target && !m.location_id) {
                        return true;
                    }
                } else if (group[0] == "T") {
                    if (
                        group.includes(m.trip_origin) &&
                        group.includes(m.trip_target)
                    ) {
                        return true;
                    }
                } else {
                    return false;
                }
            });
        }
        chat = chat.filter((m) => m.text.includes(searchInput));
    }

    return (
        <div className="chat">
            <div className="target">
                <label>
                    Chat Topic:
                    <select
                        defaultValue={"DEFAULT"}
                        name="topic"
                        onChange={(e) => {
                            setGroup(e.target.value);
                        }}
                    >
                        <option value="DEFAULT" disabled>
                            Choose...
                        </option>
                        {props.location &&
                            location_topics &&
                            location_topics.map((e, i) => {
                                return (
                                    <option key={i} value={e}>
                                        {e}
                                    </option>
                                );
                            })}
                        {other.confirmed && (
                            <option value="direct">Direct Message</option>
                        )}
                        {directMatches.length && (
                            <option disabled>MATCHES</option>
                        )}
                        {directMatches.map((elem, i) => {
                            return (
                                <option
                                    key={i}
                                    value={`T${elem.id}T${elem.match_id}T${elem.person}`}
                                >
                                    {" -  "}
                                    {elem.location_name + " ("}
                                    {new Date(
                                        elem.from_min
                                    ).toLocaleDateString()}
                                    )
                                </option>
                            );
                        })}
                    </select>
                </label>
                <input
                    type="text"
                    name="searchContent"
                    placeholder="search through past messages"
                    id="searchContent"
                    key="searchContent"
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                />
            </div>
            <div ref={chatRef} className="messages">
                {((!chat || chat.length == 0) && (
                    <div className="messages-no">
                        <p>
                            {(!group && "please select a group") ||
                                "No Messages found"}
                        </p>
                    </div>
                )) ||
                    (Array.isArray(chat) &&
                        chat.map((msg, i) => (
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
            <div
                className="new-message"
                style={{ visibility: group ? "visible" : "hidden" }}
            >
                <textarea
                    disabled={searchInput ? true : false}
                    placeholder={
                        searchInput
                            ? "Clear search field before sending a message"
                            : "Your Message..."
                    }
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
