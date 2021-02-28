import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages } from "../helpers/actions";
import { emitFriendMessage, emitTripMessage } from "../helpers/socket";
// import { receiveChatMessages } from "./action";
// import Countdown from "./countdown";
// import { format_time } from "./helpers";
// import { emitSingleMessage } from "./socket";

// FIXME sorting of messages

export default function Chat(props) {
    const chatRef = useRef(null);
    const input = useRef(null);
    const [value, setValue] = useState("");
    const [group, setGroup] = useState("");
    // const [reply, setReply] = useState("0");
    // const [placeholder, setPlaceholder] = useState("");
    const dispatch = useDispatch();
    let { chat: messages, chatError, otherUser: other, matches } = useSelector(
        (store) => store
    );
    // const chatError = useSelector((store) => store.chatError);
    // const msgError = useSelector((store) => store.msgError);
    // const activeUsers = useSelector((store) => store.activeUsers || []);

    useEffect(() => {
        // console.log("receiving chat messages...");
        if (props.type == "user+" || props.type == "user-") {
            dispatch(receiveChatMessages("general", props.user));
        }
    }, []);

    useEffect(() => {
        if (group == "direct") {
            dispatch(receiveChatMessages("general", props.user));
        } else if (group > 0) {
            dispatch(receiveChatMessages("trip", group));
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
            if (group == "" || group == "direct") {
                emitFriendMessage({
                    recipient: props.user,
                    value,
                });
            } else if (group > 0) {
                emitTripMessage({
                    recipient: props.user,
                    value,
                    group,
                });
            }
            input.current.value = "";
            input.current.focus();
        }
        setValue(null);
    };
    // console.log("active Users:", activeUsers);

    const selectGroup = function (e) {
        // console.log(e.target.innerText)
        setGroup(e.target.innerText);
    };

    if (Array.isArray(messages)) {
        messages = messages.filter((message) => {
            if (
                !message.trip_id &&
                !message.location_id &&
                (group == "" || group == "direct")
            ) {
                return true;
            } else if (message.trip_id && message.trip_id == group) {
                return true;
            } else if (message.location_id && message.location_id == group[1]) {
                return true;
            } else {
                return false;
            }
        });
    }

    return (
        // <h1>Chatis here</h1>
        <div className="chat">
            <div className="target">
                {other && other.confirmed && (
                    <div onClick={selectGroup}>direct</div>
                )}
                {other && matches && (
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
                        {matches
                            .filter((elem) => elem.person == other.id)
                            .map((elem, i) => {
                                return (
                                    <option key={i} value={elem.id}>
                                        trip #{elem.id}
                                    </option>
                                );
                            })}
                    </select>
                )}
            </div>
            <div ref={chatRef} className="messages">
                {((!messages || messages.length == 0) && (
                    <h2>No Messages found</h2>
                )) ||
                    (Array.isArray(messages) &&
                        messages.map((msg, i) => (
                            <div key={i}>
                                <p>
                                    <b>
                                        {msg.first} {msg.last}
                                    </b>
                                    , {msg.created_at}
                                </p>
                                <p>{msg.text}</p>
                            </div>
                        )))}
            </div>
            <div className="new-message">
                <textarea
                    placeholder="Your Message..."
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) => submit(e)}
                    ref={input}
                    className="chat-input"
                />
                <button
                    disabled={!value}
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

// <div className="chat">

//         <div className="chat">
//             <div className="user">
//                 <div
//                     className="user-header selected"
//                     id="0"
//                     onClick={(e) => {
//                         // e.stopPropagation();
//                         // console.log(e);
//                         setPlaceholder("");
//                         selectedUser(e);
//                     }}
//                 >
//                     <h1>ALL</h1>
//                 </div>
//                 <div className="active-users">
//                     {Array.isArray(activeUsers) &&
//                         activeUsers.map((user) => (
//                             <div
//                                 key={user.id}
//                                 id={user.id}
//                                 className="active-user"
//                                 onClick={(e) => {
//                                     setPlaceholder(
//                                         `Your Message to ${user.first}...`
//                                     );

//                                     selectedUser(e);
//                                 }}
//                             >
//                                 <div className="active-thumb">
//                                     <img src={user.profile_pic_url} />
//                                 </div>
//                                 <div className="active-name">
//                                     <b>{user.first}</b>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             </div>
//         </div>
//     )}
// </div>
