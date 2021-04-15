import { useEffect, useRef, useState } from "react";
import { formatDistance, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages, removeReduxDetail } from "../helpers/actions";
import { markAsRead } from "../helpers/socket";
import ChatSender from "./ChatSender";

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
            if (group == "direct") {
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

    let directMatches = [];
    if (Array.isArray(matches)) {
        directMatches = matches.filter((elem) => elem.person == other.id);
    }

    if (Array.isArray(chat)) {
        if (props.location) {
            chat = chat.filter((m) => {
                if (m.location_id != props.location) return false;
                if (m.location_topic === group) {
                    return true;
                } else {
                    return group === "General" && !m.location_topic
                        ? true
                        : false;
                }
            });
        }
        if (props.user && other) {
            chat = chat.filter((m) => {
                if (group == "direct") {
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

        if (!props.location) {
            let idOfSender;
            let receivedUnreadMessages = chat
                .filter((m) => !m.read_by_recipient && m.sender != user.id)
                .map((m) => {
                    idOfSender = m.sender;
                    return m.id;
                });
            if (receivedUnreadMessages.length) {
                markAsRead({ arr: receivedUnreadMessages, idOfSender });
            }
        }
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
                        {props.user && other.confirmed && (
                            <option value="direct">Direct Message</option>
                        )}
                        {props.user && directMatches.length && (
                            <option disabled>MATCHES</option>
                        )}
                        {props.user &&
                            directMatches.map((elem, i) => {
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
                                className={`${
                                    msg.sender === user.id
                                        ? "message-own"
                                        : "message"
                                } ${
                                    props.user
                                        ? msg.read_by_recipient
                                            ? ""
                                            : "unread-message"
                                        : ""
                                }`}
                            >
                                {props.user && (
                                    <div className="message-highlight">
                                        {msg.sender === user.id
                                            ? msg.read_by_recipient
                                                ? "read"
                                                : "unread"
                                            : msg.read_by_recipient
                                            ? ""
                                            : "new"}
                                    </div>
                                )}
                                <p className="message-head">
                                    <b>
                                        {msg.sender === user.id
                                            ? "you"
                                            : msg.username}
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
            {group && !searchInput && (
                <ChatSender
                    user={props.user}
                    location={props.location}
                    group={group}
                />
            )}
        </div>
    );
}
