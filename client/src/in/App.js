import { formatDistance, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateUserData } from "../helpers/actions";
import UserEdit from "./UserEdit";

export default function App() {
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
        </div>
    );

    return <h1>Test</h1>;
}

// {user && (
//     <div>
//         <h1>Hello User!</h1>
//         {!user.last_online && <UserEdit />}
//         {user.last_online && (
//         <h2>
//             last time:{" "}
//             {formatDistance(parseISO(user.last_online), Date.now())} ago
//             {details}
//         </h2>
//     )}
//     </div>
// )}
