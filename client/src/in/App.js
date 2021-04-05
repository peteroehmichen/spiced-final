import { Fragment, useEffect, useState } from "react";
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
import Navigation from "./Navigation";

export default function App() {
    let { user, errors } = useSelector((store) => store);
    const [appear, setAppear] = useState(["", ""]);
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
            {majorError || (
                <Fragment>
                    <Navigation />
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
