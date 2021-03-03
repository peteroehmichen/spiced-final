import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitFriendAction, updateFriendshipStatus } from "../helpers/actions";

export default function FriendButton(props) {
    // const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { nextFriendAction, dbError } = useSelector(
        (store) => store.otherUser
    );

    const request = async function (task) {
        dispatch(submitFriendAction(props.friendId, task));
        // console.log(task);
        if (task == "Cancel Friendship" || task == "Accept Request") {
            dispatch(updateFriendshipStatus());
        }
    };

    useEffect(() => {
        request("");
    }, []);

    // console.log("nextFriendAction:", nextFriendAction);
    // console.log("dbError:", dbError);

    if (!nextFriendAction) return null;

    return (
        <div className="friendBtn">
            <button
                onClick={() => {
                    request(nextFriendAction);
                }}
            >
                {nextFriendAction}
            </button>
            {nextFriendAction == "Accept Request" && (
                <button
                    onClick={() => {
                        dispatch(
                            submitFriendAction(props.friendId, "Deny Request")
                        );
                    }}
                >
                    Deny Request
                </button>
            )}
        </div>
    );
}
