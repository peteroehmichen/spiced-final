import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LocationTrips(props) {
    const dispatch = useDispatch();
    const { trips } = useSelector((store) => store.location);

    useEffect(() => {
        // dispatch(getTripsSummary())
    }, []);

    return (
        <div className="trips-summary">
            <p>🧗‍♀️ 23 trips</p>
        </div>
    );
}
