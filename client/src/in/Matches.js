import { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { findMatchingTrips } from "../helpers/actions";

export default function Matches(props) {
    const { matches, locations, user } = useSelector((store) => store);
    const dispatch = useDispatch();

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
            <div className={`card-container ${props.alignment}`}>
                {matches &&
                    user &&
                    locations &&
                    matches
                        .filter((elem) =>
                            props.limit == "0"
                                ? true
                                : elem.person == props.limit
                        )
                        .map((elem, i) => (
                            <Link to={`/user/${elem.person}`} key={i}>
                                <div className={`card ${props.size}`}>
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
                        ))}
            </div>
        </Fragment>
    );
}

//                     ;

//                     <div className="card-container matches">
//     <ul>
//         {matches &&
//             user &&
//             locations &&
//             matches
//                 .filter((elem) =>
//                     props.limit == "0"
//                         ? true
//                         : elem.person == props.limit
//                 )
//                 .map((elem, i) => (
//                     <li key={i}>
//                         {(props.limit == "0" && (
//                             <Link to={`/user/${elem.person}`}>
//                                 {elem.first}
//                             </Link>
//                         )) ||
//                             elem.first}
//                         s trip to {getLocationName(elem.location_id)} (
//                         {new Date(elem.from_min).toLocaleDateString()} -{" "}
//                         {new Date(elem.until_max).toLocaleDateString()}{" "}
//                         matches by {elem.match_overlap_percent}%
//                     </li>
//                 ))}
//     </ul>
// </div>
