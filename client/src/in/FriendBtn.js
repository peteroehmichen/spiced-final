import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitFriendAction } from "../helpers/actions";

export default function FriendButton(props) {
    // const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { nextFriendAction, dbError } = useSelector(
        (store) => store.otherUser
    );

    const request = async function (task) {
        dispatch(submitFriendAction(props.friendId, task));
    };

    useEffect(() => {
        request("");
    }, []);

    // console.log("nextFriendAction:", nextFriendAction);
    // console.log("dbError:", dbError);

    if (!nextFriendAction) return null;

    return (
        <button
            className={(dbError && "error-btn") || " "}
            onClick={() => {
                request(nextFriendAction);
            }}
        >
            {nextFriendAction}
        </button>
    );
}
