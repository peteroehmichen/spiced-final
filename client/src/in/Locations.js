/*
Add new Locations
Edit Locations
Rate Locations
*/

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLocations, toggleLocationForm } from "../helpers/actions";
import NewLocation from "./NewLocation";

export default function Locations() {
    const dispatch = useDispatch();
    const { activeLocationForm, locations } = useSelector((store) => store);

    useEffect(() => {
        // dispatch(getLocations());
    }, []);

    if (!locations) return null;
    // console.log(locations);
    return (
        <div className="central locations">
            <h1>Locations</h1>
            <ul>
                {locations &&
                    locations.map((elem, i) => (
                        <li key={i}>
                            {elem.continent} {elem.country}:{" "}
                            <Link to={`/location/${elem.id}`}>{elem.name}</Link>
                        </li>
                    ))}
            </ul>
            <div className="new">
                {!activeLocationForm && (
                    <button
                        onClick={() => {
                            dispatch(toggleLocationForm());
                        }}
                    >
                        Add new Location
                    </button>
                )}
                {activeLocationForm && <NewLocation />}
            </div>
        </div>
    );
}
