import { useEffect, useState } from "react";
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
            } else if (data.search) {
                setMsg(`We found ${data.result.length} matches for you`);
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
            <ul>
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
                        <h3>
                            {one}
                            <u>{tag}</u>
                            {rest}
                        </h3>
                    );
                    return (
                        <li key={index}>
                            <Link to={`/user/${elem.id}`}>{name}</Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
