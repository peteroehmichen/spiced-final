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
                <h1>NAME OF PAGE</h1>
                <HashRouter>
                    <div className="getting-started">
                        <Link to="/register">
                            <div className="link-out">Getting started</div>
                        </Link>

                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route path="/reset" component={Reset} />
                    </div>
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
