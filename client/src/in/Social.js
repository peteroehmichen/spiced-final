import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader } from "../helpers/helperComponents";
import Finder from "./Finder";
import OnlineSymbol from "./OnlineStatus";

export default function Social() {
    const all = useSelector((store) => store.friendships);
    const [searchInput, setSearchInput] = useState("");

    let friends = <Loader />;
    let requests = <Loader />;
    let pending = <Loader />;
    let none = <div>No entries found</div>;

    if (all) {
        friends = all.filter((elem) => elem.confirmed);
        friends = friends.filter((element) =>
            `${element.username}`.includes(searchInput)
        );
        requests = all.filter(
            (elem) => !elem.confirmed && elem.sender == elem.id
        );
        pending = all.filter(
            (elem) => !elem.confirmed && elem.recipient == elem.id
        );

        if (friends.length) {
            friends = friends.map((elem, i) => (
                <Link key={i} to={`/user/${elem.id}`}>
                    <div className="card small wide-small split">
                        <div className="card-left">
                            <img src={elem.picture || "/climber.svg"} />
                            <OnlineSymbol id={elem.id} style="fullText" />
                        </div>
                        <div className="card-right">
                            <div>
                                <h4>
                                    {elem.username}
                                </h4>
                            </div>
                            <div className="friend-arrow">
                                <img src="/arrow_black.png" />
                            </div>
                        </div>
                    </div>
                </Link>
            ));
        } else {
            friends = none;
        }

        if (requests.length) {
            requests = requests.map((elem, i) => (
                <Link key={i} to={`/user/${elem.id}`}>
                    <div className="found-friend">
                        <div className="friend-pic-small">
                            <img src={elem.picture || "/default.svg"} />
                        </div>
                        <div className="friend-summary">
                            <div className="friend-name">
                                <h4>
                                    {elem.username}
                                </h4>
                            </div>
                        </div>
                        <div className="friend-function">
                            <img src="/arrow_black.png" />
                        </div>
                    </div>
                </Link>
            ));
        } else {
            requests = none;
        }

        if (pending.length) {
            pending = pending.map((elem, i) => (
                <Link key={i} to={`/user/${elem.id}`}>
                    <div className="found-friend">
                        <div className="friend-pic-small">
                            <img src={elem.picture || "/default.svg"} />
                        </div>
                        <div className="friend-summary">
                            <div className="friend-name">
                                <h4>
                                    {elem.username}
                                </h4>
                            </div>
                        </div>
                        <div className="friend-function">
                            <img src="/arrow_black.png" />
                        </div>
                    </div>
                </Link>
            ));
        } else {
            pending = none;
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
                        <h3>Friendship-Requests to you</h3>
                        <div className="container-frame">
                            <div className="card-container wrapped">
                                {requests}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>Friendship-Request from you</h3>
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
