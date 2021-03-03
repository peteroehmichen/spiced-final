import { Link } from "react-router-dom";

export default function GettingStarted() {
    return (
        <div className="getting-started">
            <Link to="/register">
                <div className="link-out">
                    <h2>Getting started > > ></h2>
                </div>
            </Link>

            <p>
                Or <Link to="/login">Log In </Link>directly
            </p>
        </div>
    );
}
