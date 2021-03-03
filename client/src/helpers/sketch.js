<Link to={`/user/${elem.person}`} key={i}>
    <div className={`card medium wide split`}>
        <div className="card-left">
            <div className="card-thumb">
                <img src="/default.svg" />
            </div>
            <div className="card-image">
                <img src="/default.svg" />
            </div>
            <div className="card-text">
                <h4>{getLocationName(elem.location_id)}</h4>
            </div>
        </div>

        <div className="card-right">
            <div>
                <p>
                    {new Date(elem.from_min).toLocaleDateString()} -{" "}
                    {new Date(elem.until_max).toLocaleDateString()}
                </p>
                <p>
                    <b>Description</b>
                </p>
                <p>{elem.comment}</p>
            </div>
        </div>
    </div>
</Link>;
