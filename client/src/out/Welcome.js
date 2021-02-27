import { HashRouter, Link, Route } from "react-router-dom";
import { useEffect } from "react";

import Register from "./Register";
import Login from "./Login";
import Reset from "./Reset";

// Welcome component to render register or login (full not logged-in experience)
// sole purpose is to create the pane for registration component

// called "dumb" or "presentational" components (because they dont have much functionaility. - "Pre-hooks")
export default function Welcome() {
    return (
        <div className="welcome">
            <h1>welcome to the start - page</h1>
            <HashRouter>
                <Link to="/register">Register</Link>
                <Link to="/login">Log In</Link>
                <Link to="reset">Reset</Link>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/reset" component={Reset} />
            </HashRouter>
        </div>
    );
}
