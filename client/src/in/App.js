import { formatDistance, parseISO } from "date-fns";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    BrowserRouter,
    Link,
    Route,
    useHistory,
    useLocation,
} from "react-router-dom";
import {
    getEssentialData,
    getUserData,
    updateUserData,
} from "../helpers/actions";
import Dashboard from "./Dashboard";
import Locations from "./Locations";
import Social from "./Social";
import Profile from "./Profile";
import User from "./User";
import Location from "./Location";

export default function App() {
    const { picture } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEssentialData());
    }, []);

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
                        <div className="nav-element">All Locations</div>
                    </Link>
                    <Link to="/profile">
                        <div className="nav-element">My Profile & Trips</div>
                    </Link>
                    <Link to="/social">
                        <div className="nav-element">My Friends</div>
                    </Link>
                </div>
                <div className="nav-element logout">
                    <a href="/logout">
                        <div className="logout_on">
                            <img src={"/logOut.svg"} title="log out" />
                        </div>
                        <div className="logout_off">
                            <img
                                src={picture || "/logOut.svg"}
                                title="log out"
                            />
                        </div>
                    </a>
                </div>
            </header>
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
