import { useDispatch } from "react-redux";
import { voteLocationSection } from "../helpers/actions";

export default function SectionVote({ id }) {
    const dispatch = useDispatch();

    const vote = function (value) {
        console.log(`voting for section ${id} with ${value}`);
        dispatch(voteLocationSection(id, value));
    };

    return (
        <div className="section-voter">
            <div onClick={() => vote(1)}>↗️</div>
            <div onClick={() => vote(-1)}>↘️</div>
        </div>
    );
}
