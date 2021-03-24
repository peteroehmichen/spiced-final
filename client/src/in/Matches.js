import { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { findMatchingTrips } from "../helpers/actions";
import { GetLocationName, Loader } from "../helpers/helperComponents";

export default function Matches(props) {
    const { matches, user } = useSelector((store) => store);
    // const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(findMatchingTrips());
    }, []);

    const perc2color = function (perc) {
        // https://gist.github.com/mlocati/7210513
        var r,
            g,
            b = 0;
        if (perc < 50) {
            r = 255;
            g = Math.round(5.1 * perc);
        } else {
            g = 255;
            r = Math.round(510 - 5.1 * perc);
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1;
        return "#" + ("000000" + h.toString(16)).slice(-6);
    };

    return (
        <Fragment>
            {!matches || !user ? (
                <Loader />
            ) : matches.length == 0 ? (
                <p>You currently have no matches.</p>
            ) : (
                <Fragment>
                    {props.mode == "user" &&
                        matches
                            .filter((elem) =>
                                props.limit == "0"
                                    ? true
                                    : elem.person == props.limit
                            )
                            .map((elem, i) => (
                                <div
                                    key={i}
                                    className="card medium extrawide split"
                                    style={{
                                        border: `4px solid ${perc2color(
                                            elem.match_overlap_percent
                                        )}`,
                                    }}
                                >
                                    <div className="card-left-XL">
                                        <div className="percent">
                                            <h1
                                                style={{
                                                    color: perc2color(
                                                        elem.match_overlap_percent
                                                    ),
                                                }}
                                            >
                                                {elem.match_overlap_percent}%
                                            </h1>
                                        </div>
                                        <img
                                            src={elem.picture || "/default.svg"}
                                        />
                                    </div>

                                    <div className="card-right-match">
                                        <div>
                                            <h3>
                                                <GetLocationName
                                                    id={elem.location_id}
                                                />
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
                                                <i>{elem.comment}</i>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    {props.mode == "dashboard" &&
                        matches.map((elem, i) => (
                            <Link to={`/user/${elem.person}`} key={i}>
                                <div
                                    className="card small"
                                    style={{
                                        border: `4px solid ${perc2color(
                                            elem.match_overlap_percent
                                        )}`,
                                    }}
                                >
                                    <div className="card-image">
                                        <img
                                            src={elem.picture || "/default.svg"}
                                        />
                                    </div>
                                    <div className="card-text">
                                        <h4>
                                            <GetLocationName
                                                id={elem.location_id}
                                            />
                                        </h4>
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
                                    <div className="percent-small">
                                        {elem.match_overlap_percent}%
                                    </div>
                                </div>
                            </Link>
                        ))}
                </Fragment>
            )}
        </Fragment>
    );
}
