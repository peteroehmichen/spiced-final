import { useDispatch } from "react-redux";
import { voteLocationSection } from "../helpers/actions";

export default function SectionVote({ id, up, down, sum }) {
    const dispatch = useDispatch();

    const vote = function (value) {
        // console.log(`voting for section ${id} with ${value}`);
        if (up && value === 1) {
            console.log("already voted up...");
        } else if (down && value === -1) {
            console.log("already voted down...");
        } else {
            dispatch(voteLocationSection(id, value));
        }
    };

    return (
        <div className="section-voter">
            <div
                style={{ visibility: up ? "hidden" : "visible" }}
                onClick={() => vote(1)}
            >
                <b>+</b>
            </div>
            <p>{sum}</p>
            <div
                style={{ visibility: down ? "hidden" : "visible" }}
                onClick={() => vote(-1)}
            >
                <b>-</b>
            </div>
        </div>
    );
}
