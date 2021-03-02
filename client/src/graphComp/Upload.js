import { useDispatch } from "react-redux";
import { toggleUploadModal, toggleTripUploadModal } from "../helpers/actions";

export default function Upload(props) {
    const dispatch = useDispatch();
    return (
        <div
            className="upload"
            onClick={() => {
                if (props.trip) {
                    dispatch(toggleTripUploadModal(props.trip));
                } else {
                    dispatch(toggleUploadModal());
                }
            }}
        >
            <h1>✎</h1>
        </div>
    );
}
