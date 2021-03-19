import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { getEssentialData } from "../helpers/actions";
import Dashboard from "./Dashboard";
import Locations from "./Locations";
import Social from "./Social";
import Profile from "./Profile";
import User from "./User";
import Location from "./Location";

import { Toaster } from "react-hot-toast";

export default function App() {
    let { user, errors } = useSelector((store) => store);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEssentialData());
    }, []);

    let majorError;
    if (errors?.major) {
        // TODO is this the best way to logout with BTN??
        majorError = (
            <div className="central">
                <h1>There seems to be a major error</h1>
                <h2>{errors.major}</h2>
                <button onClick={() => window.location.reload()}>
                    Click to reload!
                </button>
                <a href="/logout">
                    <button>CLOSE SESSION -- Logout</button>
                </a>
            </div>
        );
    }

    return (
        <BrowserRouter>
            {majorError && majorError}
            {!majorError && (
                <Fragment>
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
                                <div className="nav-element">
                                    Profile & Trips
                                </div>
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
                </Fragment>
            )}
        </BrowserRouter>
    );
}
