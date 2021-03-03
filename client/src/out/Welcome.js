import { HashRouter, Link, Route } from "react-router-dom";
import { Fragment, useEffect } from "react";

import Register from "./Register";
import Login from "./Login";
import Reset from "./Reset";
import GettingStarted from "./GettingStarted";

// Welcome component to render register or login (full not logged-in experience)
// sole purpose is to create the pane for registration component

// called "dumb" or "presentational" components (because they dont have much functionaility. - "Pre-hooks")
export default function Welcome() {
    return (
        <Fragment>
            <div className="central out">
                <h1>NAME OF PAGE</h1>
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

// <Link to="/login">
//                             <div className="link-out">LogIn</div>
//                         </Link>
//                         <Link to="reset">
//                             <div className="link-out">Reset</div>
//                         </Link>
