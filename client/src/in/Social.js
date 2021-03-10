import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    acceptRequest,
    cancelRequest,
    denyRequest,
    getFriendships,
    unfriend,
} from "../helpers/actions";
import Finder from "./Finder";

export default function Social() {
    const dispatch = useDispatch();
    const all = useSelector((store) => store.friendships);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        dispatch(getFriendships());
    }, []);

    let friends = <div>There are none</div>;
    let requests;
    let pending;
    let error;

    if (!all) {
        // console.log("exiting");
        return null;
    } else if (all.error) {
        console.log("We hit an error:", all.error);
        error = all.error;
    } else if (all.length > 0) {
        friends = all.filter((elem) => elem.confirmed);
        friends = friends.filter(
            (element) =>
                `${element.first} ${element.last}`.includes(searchInput)
            // element.first.includes(searchInput) ||
            //     element.last.includes(searchInput)
        );
        requests = all.filter(
            (elem) => !elem.confirmed && elem.sender == elem.id
        );
        pending = all.filter(
            (elem) => !elem.confirmed && elem.recipient == elem.id
        );

        if (!friends.length) {
            friends = (
                <div className="noFriendMsg">
                    <h3>You are not connected to anybody so far</h3>
                </div>
            );
        } else {
            friends = friends.map((elem, i) => (
                <Link key={i} to={`/user/${elem.id}`}>
                    <div className="card small wide-small split">
                        <div className="card-left">
                            <img src={elem.picture || "/default.svg"} />
                        </div>
                        <div className="card-right">
                            <div>
                                <h4>
                                    {elem.first} {elem.last}
                                </h4>
                            </div>
                            <div className="friend-arrow">
                                <img src="/arrow_black.png" />
                            </div>
                        </div>
                    </div>
                </Link>
            ));
        }

        if (!requests.length) {
            requests = <div>There are none</div>;
        } else {
            requests = requests.map((elem, i) => (
                <Link key={i} to={`/user/${elem.id}`}>
                    <div className="found-friend">
                        <div className="friend-pic-small">
                            <img src={elem.picture || "/default.svg"} />
                        </div>
                        <div className="friend-summary">
                            <div className="friend-name">
                                <h4>
                                    {elem.first} {elem.last}
                                </h4>
                            </div>
                        </div>
                        <div className="friend-function">
                            <img src="/arrow_black.png" />
                        </div>
                    </div>
                </Link>
            ));
        }
        if (!pending.length) {
            pending = <div>There are none</div>;
        } else {
            pending = pending.map((elem, i) => (
                <Link key={i} to={`/user/${elem.id}`}>
                    <div className="found-friend">
                        <div className="friend-pic-small">
                            <img src={elem.picture || "/default.svg"} />
                        </div>
                        <div className="friend-summary">
                            <div className="friend-name">
                                <h4>
                                    {elem.first} {elem.last}
                                </h4>
                            </div>
                        </div>
                        <div className="friend-function">
                            <img src="/arrow_black.png" />
                        </div>
                    </div>
                </Link>
            ));
        }
    }

    return (
        <div className="central social">
            <div className="friend-one">
                <h1>Your Friends</h1>
                <input
                    type="text"
                    name="filterFriend"
                    placeholder="Filter for a friend"
                    key="filterFriend"
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                />
                <div className="container-frame">
                    <div className="card-container inprofile horizontal">
                        {friends}
                    </div>
                </div>
            </div>
            <div className="friend-two">
                <h1>Grow your Community of Climbers</h1>
                <div className="grow-split">
                    <div>
                        <h3>Friend-Requests to you</h3>
                        <div className="container-frame">
                            <div className="card-container wrapped">
                                {requests}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>Friend-Request from you</h3>
                        <div className="container-frame">
                            <div className="card-container wrapped">
                                {pending}
                            </div>
                        </div>
                    </div>

                    <Finder />
                </div>
            </div>
        </div>
    );
}
