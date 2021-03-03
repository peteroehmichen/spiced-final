/*
Add new Locations
Edit Locations
Rate Locations
*/

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLocations, toggleLocationForm } from "../helpers/actions";
import NewLocation from "./NewLocation";

export default function Locations() {
    const dispatch = useDispatch();
    const { activeLocationForm, locations } = useSelector((store) => store);
    const [searchInput, setSearchInput] = useState("");

    // useEffect(() => {
    //     console.log()
    // }, [searchInput]);

    if (!locations) return null;
    // console.log(locations);
    // FIXME case sensitive!!
    const filteredLocations = locations.filter(
        (element) =>
            element.name.includes(searchInput) ||
            element.continent.includes(searchInput) ||
            element.country.includes(searchInput)
    );

    return (
        <div className="central locations">
            <input
                type="text"
                name="searchLocation"
                placeholder="Filter for a name, continent or country"
                id="searchLocation"
                key="searchLocation"
                onChange={(e) => {
                    setSearchInput(e.target.value);
                    // console.log(e.target.value);
                }}
            />

            <div className="card-container wrapped">
                <div className="card medium start">
                    {!activeLocationForm && (
                        <h1
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                dispatch(toggleLocationForm());
                            }}
                        >
                            ✚
                        </h1>
                    )}
                    {activeLocationForm && <NewLocation />}
                </div>
                {filteredLocations &&
                    filteredLocations.map((elem, i) => (
                        <Link to={`/location/${elem.id}`} key={i}>
                            <div className="card medium">
                                <div className="card-image">
                                    <img src={elem.picture || "/default.svg"} />
                                </div>
                                <div className="card-text">
                                    <h4>{elem.name}</h4>
                                    <p>{elem.country}</p>
                                    <p>{elem.continent}</p>
                                </div>
                                <div className="card-foot">
                                    {elem.rate_avg && (
                                        <div>
                                            Solo-Rating: ⭐️{" "}
                                            {Math.round(elem.rate_avg * 10) /
                                                10}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
}
