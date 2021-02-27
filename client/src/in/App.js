import { formatDistance, parseISO } from "date-fns";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import {
    getEssentialData,
    getUserData,
    updateUserData,
} from "../helpers/actions";
import Dashboard from "./Dashboard";
import Locations from "./Locations";
import Social from "./Social";
import Trips from "./Trips";
import User from "./User";
import Location from "./Location";
// actually need to get the store-data for location, etc already here!

export default function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEssentialData());
    }, []);

    return (
        <BrowserRouter>
            <header>
                <Link to="/">
                    <div className="nav-element">Dashboard</div>
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
                <a href="/logout">
                    <div className="nav-element grey">Logout</div>
                </a>
            </header>
            <Fragment>
                <Route exact path="/" render={() => <Dashboard />} />
                <Route path="/locations" render={() => <Locations />} />
                <Route path="/social" render={() => <Social />} />
                <Route path="/trips" render={() => <Trips />} />
                <Route
                    path="/user/:id"
                    render={(props) => (
                        <User
                            key={props.match.url}
                            history={props.history}
                            match={props.match}
                        />
                    )}
                />
                <Route
                    path="/location/:id"
                    render={(props) => (
                        <Location
                            key={props.match.url}
                            history={props.history}
                            match={props.match}
                        />
                    )}
                />
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
