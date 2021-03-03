import { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { findMatchingTrips } from "../helpers/actions";

export default function Matches(props) {
    const { matches, locations, user } = useSelector((store) => store);
    const dispatch = useDispatch();

    let containerCSS = "";
    let cardCSS = "";
    if (props.mode == "user") {
        cardCSS = "medium wide split";
        containerCSS = "";
    } else if (props.mode == "dashboard") {
        cardCSS = "";
        containerCSS = "";
    }

    useEffect(() => {
        dispatch(findMatchingTrips());
    }, []);

    const getLocationName = function (id) {
        const obj = locations.find((loc) => loc.id == id);
        return obj.name;
    };

    return (
        <Fragment>
            <h1>Matches</h1>
            <div className={`card-container wrapped`}>
                {matches &&
                    user &&
                    locations &&
                    matches
                        .filter((elem) =>
                            props.limit == "0"
                                ? true
                                : elem.person == props.limit
                        )
                        .map((elem, i) => {
                            if (props.mode == "user") {
                                return (
                                    <div
                                        key={i}
                                        className="card medium extrawide split"
                                    >
                                        <div className="card-left-XL">
                                            <img
                                                src={
                                                    elem.picture ||
                                                    "/default.svg"
                                                }
                                            />
                                        </div>

                                        <div className="card-right-match">
                                            <div>
                                                <h3>
                                                    {getLocationName(
                                                        elem.location_id
                                                    )}
                                                </h3>
                                                <p>
                                                    {new Date(
                                                        elem.from_min
                                                    ).toLocaleDateString()}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        elem.until_max
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <b>Description</b>
                                                </p>
                                                <p>{elem.comment}</p>
                                                <div className="card-foot">
                                                    {elem.match_overlap_percent}
                                                    % match
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <Link to={`/user/${elem.person}`} key={i}>
                                        <div className={`card ${cardCSS}`}>
                                            <div className="card-thumb">
                                                <img src="/default.svg" />
                                            </div>
                                            <div className="card-image">
                                                <img src="/default.svg" />
                                            </div>
                                            <div className="card-text">
                                                <h4>
                                                    {(props.limit == "0" &&
                                                        elem.first) ||
                                                        elem.first}
                                                    s trip to{" "}
                                                    {getLocationName(
                                                        elem.location_id
                                                    )}
                                                </h4>
                                                <p>
                                                    (
                                                    {new Date(
                                                        elem.from_min
                                                    ).toLocaleDateString()}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        elem.until_max
                                                    ).toLocaleDateString()}
                                                    )
                                                </p>
                                            </div>
                                            <div className="card-foot">
                                                {elem.match_overlap_percent}%
                                                match
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }
                        })}
            </div>
        </Fragment>
    );
}

/*

<Link to={`/user/${elem.person}`} key={i}>
                                    <div className={`card ${cardCSS}`}>
                                        <div className="card-thumb">
                                            <img src="/default.svg" />
                                        </div>
                                        <div className="card-image">
                                            <img src="/default.svg" />
                                        </div>
                                        <div className="card-text">
                                            <h4>
                                                {(props.limit == "0" &&
                                                    elem.first) ||
                                                    elem.first}
                                                s trip to{" "}
                                                {getLocationName(elem.location_id)}
                                            </h4>
                                            <p>
                                                (
                                                {new Date(
                                                    elem.from_min
                                                ).toLocaleDateString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    elem.until_max
                                                ).toLocaleDateString()}
                                                )
                                            </p>
                                        </div>
                                        <div className="card-foot">
                                            {elem.match_overlap_percent}% match
                                        </div>
                                    </div>
                                </Link>


*/
