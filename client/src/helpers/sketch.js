<Link to={`/user/${elem.id}`}>
    <div key={i} className="card small wide split">
        <div className="card-left">
            <img src={elem.picture || "/default.svg"} />
        </div>
        <div className="card-right">
            <div>
                <h4>
                    {elem.first} {elem.last}
                </h4>
            </div>
            <div className="summary">Trips friends Matches</div>
        </div>
    </div>
</Link>;
