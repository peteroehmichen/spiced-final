import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../helpers/actions";
import axios from "../helpers/axios";

/*
Summary from other Elements
- trips I have planned
- friends and their trips
- locations I follow
*/

export default function Dashboard() {
    const { user, grades, experience } = useSelector((store) => store);
    const dispatch = useDispatch();
    // const [countries, setCountries] = useState([]);

    useEffect(async () => {}, []);

    if (!user || !grades || !experience) return null;

    return (
        <div className="central dashboard">
            <h1>Dashboard</h1>
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
                    <b>Your Climbing Grade:</b> {grades[user.grade_comfort]} up
                    to {grades[user.grade_max]}
                </p>
                <p>
                    <b>Your Experience:</b> {experience[user.experience]}
                </p>
                <p>
                    <b>Brief Description:</b> {user.description}
                </p>
            </div>
        </div>
    );
}
