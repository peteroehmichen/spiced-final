import { HashRouter, Link, Route } from "react-router-dom";
import { Fragment, useEffect } from "react";

import Register from "./Register";
import Login from "./Login";
import Reset from "./Reset";

// Welcome component to render register or login (full not logged-in experience)
// sole purpose is to create the pane for registration component

// called "dumb" or "presentational" components (because they dont have much functionaility. - "Pre-hooks")
export default function Welcome() {
    return (
        <Fragment>
            <div className="central">
                <h1>welcome to the start - page</h1>
                <HashRouter>
                    <Link to="/register">
                        <div className="link-out">Register</div>
                    </Link>
                    <Link to="/login">
                        <div className="link-out">Register</div>
                    </Link>
                    <Link to="reset"></Link>
                    <div className="link-out">Register</div>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </HashRouter>
            </div>
        </Fragment>
    );
}
