import { useState } from "react";
import Login from "./Login";
import OAuth from "./OAuth";
import Register from "./Register";
import TabNavigator from "./TabNavigator";

export default function Authenticate() {
    /*
in here I will call the Tabs wrapper and include all Components with Label
*/

    return (
        <div className="out-main">
            <h3>Please provide your credentials</h3>
            <TabNavigator>
                <Register label="Register an account" />
                <Login label="Log In" />
                <OAuth label="GitHub, Google, etc." />
            </TabNavigator>
        </div>
    );
}
