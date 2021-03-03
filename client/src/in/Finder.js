import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";

import axios from "../helpers/axios";

export default function Finder() {
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState("");
    const [searchError, setSearchError] = useState("");

    useEffect(async () => {
        // console.log("Firing!");
        let abort;
        if (!searchInput) {
            setUsers([]);
            setMsg("");
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
                placeholder="Search through our Users"
                id="searchFriend"
                key="searchFriend"
                onChange={(e) => {
                    setSearchInput(e.target.value);
                }}
            />
            <h4>{msg}</h4>
            <div>
                {users.map((elem, index) => {
                    let name = elem.first + " " + elem.last;
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
                        <div key={index} className="found-friend">
                            <div className="friend-pic-small">
                                <img src={elem.picture || "/default.svg"} />
                            </div>
                            <div className="friend-summary">
                                <div className="friend-name">
                                    <h4>{name}</h4>
                                </div>
                            </div>
                            <div className="friend-function">
                                <Link to={`/user/${elem.id}`}>
                                    <img src="/arrow_black.png" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
