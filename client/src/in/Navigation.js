import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <div className="navigation">
            <Link to="/">
                <div className="nav-logo">
                    <img src="/noun_Rope_61701.svg" />
                </div>
            </Link>

            <div className="nav-content">
                <Link to="/locations">
                    <div className="nav-element">
                        <div>all Crags</div>
                        <div className="nav-icon">
                            <img src="/noun_Location_3835410.svg" />
                        </div>
                    </div>
                </Link>
                <Link to="/profile">
                    <div className="nav-element">
                        <div>your Profile & Trips</div>
                        <div className="nav-icon">
                            <img src="/noun_User_2899746.svg" />
                        </div>
                    </div>
                </Link>
                <Link to="/social">
                    <div className="nav-element">
                        <div>other Climbers</div>
                        <div className="nav-icon">
                            <img src="/noun_Social_1555550.svg" />
                        </div>
                    </div>
                </Link>
                <a href="/logout">
                    <div className="nav-element">
                        <div>Logout</div>
                        <div className="nav-icon">
                            <img src="/noun_logout_3324829.svg" />
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

/*
<header>
                        <div className="nav-bar">
                            <div className="nav-element logo">
                                <Link
                                    to="/"
                                    onMouseOver={() => {
                                        setAppear([" nav-hover", ""]);
                                    }}
                                    onMouseOut={() => {
                                        setAppear(["", ""]);
                                    }}
                                >
                                    <div className="nav-icon">
                                        <img src="/noun_Rope_61701.png" />
                                    </div>
                                </Link>
                                <div className={"moving" + appear[0]}>
                                    Dashboard
                                </div>
                            </div>
                            <Link to="/locations">
                                <div className="nav-element">All Crags</div>
                            </Link>
                            <Link to="/profile">
                                <div className="nav-element">
                                    Your Profile & Trips
                                </div>
                            </Link>
                            <Link to="/social">
                                <div className="nav-element">
                                    Other Climbers
                                </div>
                            </Link>
                            <div className="nav-element logout">
                                <div className={"moving" + appear[1]}>
                                    Logout
                                </div>
                                <a
                                    href="/logout"
                                    onMouseOver={() => {
                                        setAppear(["", " nav-hover"]);
                                    }}
                                    onMouseOut={() => {
                                        setAppear(["", ""]);
                                    }}
                                >
                                    <div className="nav-icon">
                                        <img
                                            src={user.picture || "/climber.svg"}
                                            title="log out"
                                        />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </header>
*/
