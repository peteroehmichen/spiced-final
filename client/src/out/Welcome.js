import { HashRouter, Link, Route } from "react-router-dom";
import { Fragment, useEffect } from "react";

import Register from "./Register";
import Login from "./Login";
import Reset from "./Reset";
import GettingStarted from "./GettingStarted";

export default function Welcome() {
    return (
        <Fragment>
            <div className="central out">
                <div className="logoStartFrame">
                    <img className="logoStart" src="/noun_Rope_61701.png" />
                    <h1>THE SHARP END</h1>
                </div>
                <HashRouter>
                    <Route exact path="/" component={GettingStarted} />
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </HashRouter>
            </div>
        </Fragment>
    );
}
