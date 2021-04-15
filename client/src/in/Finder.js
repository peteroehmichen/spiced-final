import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";

import axios from "../helpers/axios";

export default function Finder() {
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState("");
    const [searchError, setSearchError] = useState("");

    useEffect(async () => {
        // TODO delay to limit searches
        // FIXME still a bit dysfunctional
        let abort;
        if (!searchInput) {
            setUsers([]);
            setMsg("");
            return;
        } else if (searchInput.length < 3) {
            return;
        } else if (searchInput == " ") {
            setSearchInput("");
            return;
        }
        try {
            const { data } = await axios.get(
                `/api/findUsers.json?search=${searchInput}`
            );
            // console.log("data:", data);
            if (!data.result) {
                data.result = [];
            }
            if (!abort) {
                setUsers(data.result);
            }
            if (data.error) {
                setSearchError(data.error);
            } else if (data.empty) {
                setMsg(data.empty);
            }
        } catch (err) {
            setSearchError("We encountered an unknown error");
        }
        return () => {
            abort = true;
        };
    }, [searchInput]);

    return (
        <div>
            <input
                type="text"
                name="searchFriend"
                placeholder="Search for other Climbers"
                id="searchFriend"
                key="searchFriend"
                onChange={(e) => {
                    if (!e.target.value.startsWith(" ")) {
                        setSearchInput(e.target.value);
                    }
                }}
            />
            <h4>{msg}</h4>
            <div>
                {users.map((elem, index) => {
                    let name = elem.username;
                    const regex = new RegExp(searchInput, "gi");
                    const one = name.slice(0, name.search(regex));
                    const tag = name.substr(
                        name.search(regex),
                        searchInput.length
                    );
                    const rest = name.slice(
                        name.search(regex) + searchInput.length
                    );
                    name = (
                        <Fragment>
                            {one}
                            <u>{tag}</u>
                            {rest}
                        </Fragment>
                    );
                    return (
                        <Link key={index} to={`/user/${elem.id}`}>
                            <div className="found-friend">
                                <div className="friend-pic-small">
                                    <img src={elem.picture || "/default.svg"} />
                                </div>
                                <div className="friend-summary">
                                    <div className="friend-name">
                                        <h4>{name}</h4>
                                    </div>
                                </div>
                                <div className="friend-function">
                                    <img src="/arrow_black.png" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
