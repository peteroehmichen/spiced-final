import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitFriendAction } from "../helpers/actions";

export default function FriendButton(props) {
    const dispatch = useDispatch();
    const { nextFriendAction } = useSelector((store) => store.otherUser);

    const request = async function (task) {
        dispatch(submitFriendAction(props.friendId, task));
    };

    useEffect(() => {
        request("");
    }, []);

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
