import Login from "./Login";
import OAuth from "./OAuth";
import Register from "./Register";
import TabNavigator from "./TabNavigator";

export default function Authenticate() {
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
