<div className="central dashboard">
    <ul className="todo">
        <li>view my trips</li>
        <li>view pinned friends trips</li>
        <li>(maybe notifications)</li>
    </ul>

    <h1>Your Friends Trips</h1>
    <div className="card-container">
        {trips &&
            locations &&
            user &&
            trips
                .filter((trip) => trip.person != user.id)
                .map((elem, i) => (
                    <div className="card small" key={i}>
                        <div className="card-thumb">
                            <img src="/default.svg" />
                        </div>
                        <div className="card-image">
                            <img src="/default.svg" />
                        </div>
                        <div className="card-text">
                            <h4>
                                {elem.first} {elem.last[0]}.
                            </h4>
                            <p>
                                {new Date(elem.from_min).toLocaleDateString()} -{" "}
                                {new Date(elem.until_max).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="card-foot"></div>
                    </div>
                ))}
    </div>
</div>;

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
                {(props.limit == "0" && elem.first) || elem.first}s trip to{" "}
                {getLocationName(elem.location_id)}
            </h4>
            <p>
                ({new Date(elem.from_min).toLocaleDateString()} -{" "}
                {new Date(elem.until_max).toLocaleDateString()})
            </p>
        </div>
        <div className="card-foot">{elem.match_overlap_percent}% match</div>
    </div>
</Link>;
