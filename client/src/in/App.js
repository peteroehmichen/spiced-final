import { formatDistance, parseISO } from "date-fns";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { getUserData, updateUserData } from "../helpers/actions";
import Dashboard from "./Dashboard";
import Locations from "./Locations";
import Social from "./Social";
import Trips from "./Trips";
import UserEdit from "./UserEdit";

export default function App() {
    return (
        <BrowserRouter>
            <header>
                <Link to="/">
                    <div className="nav-element">Start</div>
                </Link>
                <Link to="/locations">
                    <div className="nav-element">Locations</div>
                </Link>
                <Link to="/trips">
                    <div className="nav-element">Your Trips</div>
                </Link>
                <Link to="/social">
                    <div className="nav-element">Friends</div>
                </Link>
            </header>
            <Fragment>
                <Route exact path="/" render={() => <Dashboard />} />
                <Route path="/locations" render={() => <Locations />} />
                <Route path="/social" render={() => <Social />} />
                <Route path="/trips" render={() => <Trips />} />
            </Fragment>
        </BrowserRouter>
    );
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
