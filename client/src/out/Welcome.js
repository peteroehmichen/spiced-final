import { HashRouter, Route } from "react-router-dom";
import { Fragment } from "react";

import GettingStarted from "./GettingStarted";
import { Toaster } from "react-hot-toast";
import Authenticate from "./Authenticate";

export default function Welcome() {
    return (
        <Fragment>
            <div
                className="central out"
                style={{
                    backgroundImage: `url(/bg_intro.jpg)`,
                    backgroundSize: "cover",
                }}
            >
                <div className="logoStartFrame">
                    <img className="logoStart" src="/noun_Rope_61701.png" />
                    <h1>THE SHARP END</h1>
                    <h4>a network for travelling climbers</h4>
                </div>
                <HashRouter>
                    <Route exact path="/" component={GettingStarted} />
                    <Route path="/auth" component={Authenticate} />
                </HashRouter>
            </div>
            <Toaster />
            <div className="photocredit-out">
                Logo “Rope” by Icons, RU, from the Noun Project.
            </div>
        </Fragment>
    );
}
