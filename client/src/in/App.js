import { formatDistance, parseISO } from "date-fns";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { getEssentialData } from "../helpers/actions";
import Dashboard from "./Dashboard";
import Locations from "./Locations";
import Social from "./Social";
import Profile from "./Profile";
import User from "./User";
import Location from "./Location";

import toast, { Toaster } from "react-hot-toast";
// const notify = (text) => toast("Here is your toast.");

export default function App() {
    let { user, errors } = useSelector((store) => store);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEssentialData());
    }, []);

    let errScreen;
    if (errors) {
        const notifications = errors.filter(
            (element) => element.type == "notifications"
        );
        const essential = errors.find((element) => element.type == "essential");
        if (essential) {
            errScreen = (
                <div className="central">
                    <h2>{essential.text}</h2>
                    <button onClick={() => window.location.reload()}>
                        Click to reload!
                    </button>
                </div>
            );
        } else if (notifications) {
            for (let i = 0; i < notifications.length; i++) {
                // toast.success(notifications[i].text);
            }
        }
    }

    return (
        <BrowserRouter>
            <header>
                <div className="nav-element logo">
                    <img src="/noun_Rope_61701.png" />
                </div>
                <div className="nav-bar">
                    <Link to="/">
                        <div className="nav-element">Dashboard</div>
                    </Link>
                    <Link to="/locations">
                        <div className="nav-element">Crags</div>
                    </Link>
                    <Link to="/profile">
                        <div className="nav-element">Profile & Trips</div>
                    </Link>
                    <Link to="/social">
                        <div className="nav-element">Climbers</div>
                    </Link>
                </div>
                <div className="nav-element logout">
                    <a href="/logout">
                        <div className="logout_on">
                            <img src={"/logOut.svg"} title="log out" />
                        </div>
                        <div className="logout_off">
                            <img
                                src={user.picture || "/logOut.svg"}
                                title="log out"
                            />
                        </div>
                    </a>
                </div>
            </header>
            {(errScreen && errScreen) || (
                <Fragment>
                    <Route exact path="/" render={() => <Dashboard />} />
                    <Route path="/locations" render={() => <Locations />} />
                    <Route path="/social" render={() => <Social />} />
                    <Route path="/profile" render={() => <Profile />} />
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

                    <Toaster />
                </Fragment>
            )}
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
