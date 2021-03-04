import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLocationRating, changeMyRating } from "../helpers/actions";

export default function LocationRating(props) {
    const { rating } = useSelector((store) => store);
    // 1) summary value and sum of opinions
    // 2) either function to delete own rating or add new rating
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getLocationRating(props.id));
    }, []);

    const submit = function (e) {
        if (e.target.innerText.includes("remove")) {
            dispatch(changeMyRating("delete", props.id));
            // console.log("deleting my rateing");
        } else if (e.target.value) {
            dispatch(changeMyRating(e.target.value, props.id));
            // console.log("adding", e);
        }
    };

    const avg = rating && (
        <b>
            Solo-Rating:{" "}
            {rating.sum > 0 && `${Math.round(rating.avg * 10) / 10}*`} (
            {rating.sum} reviews)
        </b>
    );
    let own;
    if (rating && rating.your_rating) {
        own = (
            <span onClick={submit}>
                remove your {rating.your_rating} * rating
            </span>
        );
    } else if (rating) {
        own = (
            <label>
                <select
                    defaultValue={"DEFAULT"}
                    name="rating"
                    onChange={submit}
                >
                    <option value="DEFAULT" disabled>
                        your Rating...
                    </option>
                    <option value="0">o</option>
                    <option value="1">*</option>
                    <option value="2">* *</option>
                    <option value="3">* * *</option>
                    <option value="4">* * * *</option>
                    <option value="5">* * * * *</option>
                </select>
            </label>
        );
    }

    return (
        <div className="rating">
            <p>{avg}</p>
            <p>{own}</p>
        </div>
    );
}