/*
Add new Locations
Edit Locations
Rate Locations
*/

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLocations, toggleLocationForm } from "../helpers/actions";
import NewLocation from "./NewLocation";

export default function Trips() {
    const dispatch = useDispatch();
    const { activeLocationForm, locations } = useSelector((store) => store);

    useEffect(() => {
        dispatch(getLocations());
    }, []);

    if (!locations) return null;
    // console.log(locations);
    return (
        <div className="central locations">
            <h1>Your Trips</h1>
            <p>List of Locations</p>
            <ul>
                {locations &&
                    locations.map((elem, i) => (
                        <li key={i}>
                            {elem.continent} {elem.country}: {elem.name}
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
