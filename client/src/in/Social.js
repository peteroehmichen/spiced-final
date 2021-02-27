import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    acceptRequest,
    cancelRequest,
    denyRequest,
    getFriendships,
    unfriend,
} from "../helpers/actions";

export default function Social() {
    const dispatch = useDispatch();
    const all = useSelector((store) => store.friendships);

    useEffect(() => {
        dispatch(getFriendships());
    }, []);

    let friends = <div>There are none</div>;
    let requests;
    let pending;
    let error;

    if (!all) {
        console.log("exiting");
        return null;
    } else if (all.error) {
        console.log("We hit an error:", all.error);
        error = all.error;
    } else if (all.length > 0) {
        friends = all.filter((elem) => elem.confirmed);
        requests = all.filter(
            (elem) => !elem.confirmed && elem.sender == elem.id
        );
        pending = all.filter(
            (elem) => !elem.confirmed && elem.recipient == elem.id
        );

        if (!friends.length) {
            friends = <div>There are none</div>;
        } else {
            friends = friends.map((elem) => (
                <div key={elem.id}>
                    <Link to={`/user/${elem.id}`}>
                        <h3>
                            {elem.first} {elem.last}
                        </h3>
                    </Link>
                    <h2 onClick={() => dispatch(unfriend(elem.id))}>✘</h2>
                </div>
            ));
        }

        requests = requests.map((elem) => (
            <div key={elem.id}>
                <Link to={`/user/${elem.id}`}>
                    <h3>
                        {elem.first} {elem.last}
                    </h3>
                </Link>
                <h2 onClick={() => dispatch(acceptRequest(elem.id))}>✓</h2>
                <h2 onClick={() => dispatch(denyRequest(elem.id))}>✘</h2>
            </div>
        ));

        pending = pending.map((elem) => (
            <div key={elem.id}>
                <Link to={`/user/${elem.id}`}>
                    <h3>
                        {elem.first} {elem.last}
                    </h3>
                </Link>
                <h2 onClick={() => dispatch(cancelRequest(elem.id))}>✘</h2>
            </div>
        ));
    }

    return (
        <div className="central social">
            <h1>Social</h1>
            <div>
                <h3>Your Friends</h3>
                <div>{friends}</div>
            </div>
            {requests && requests.length > 0 && (
                <div>
                    <h3>Friend-Requests awaiting your answer</h3>
                    <div>{requests}</div>
                </div>
            )}
            {pending && pending.length > 0 && (
                <div>
                    <h3>Unanswered Friend-Request from you</h3>
                    <div>{pending}</div>
                </div>
            )}
        </div>
    );
}
