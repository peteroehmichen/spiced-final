import { Link } from "react-router-dom";

export default function GettingStarted() {
    return (
        <div className="getting-started">
            <p>
                <b>DISCLAIMER: </b> this page is not yet meant for public use!
                It is being developed as we speak. The displayed material
                (users, pictures, icons, etc.) is meant to showcase the idea and
                steps towards realization - no copyright infringement is
                intended.
            </p>
            <Link to="/auth">
                <div className="link-out">
                    <h2>Getting started</h2>
                </div>
            </Link>
        </div>
    );
}
