import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../helpers/actions";

/*
Summary from other Elements
- trips I have planned
- friends and their trips
- locations I follow
*/

export default function Dashboard() {
    const { user, grades } = useSelector((store) => store);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserData("0"));
    }, []);

    const details = user && (
        <div>
            <p>
                <b>Your Name:</b> {user.first} {user.last}
            </p>
            <p>
                <b>Your Age:</b> {user.age}
            </p>
            <p>
                <b>Your E-Mail:</b> {user.email}
            </p>
            <p>
                <b>Your Location:</b> {user.location}
            </p>
            <p>
                <b>Your Climbing Grade:</b> {user.grade_comfort} up to{" "}
                {user.grade_max}
            </p>
            <p>
                <b>Your Experience:</b> {user.experience}
            </p>
            <p>
                <b>Brief Description:</b> {user.description}
            </p>
            <a href="/logout">LOGOUT</a>
        </div>
    );

    return (
        <div className="central dashboard">
            <h1>Dashboard</h1>
            {details}
        </div>
    );
}
