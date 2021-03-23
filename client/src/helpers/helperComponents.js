import { useSelector } from "react-redux";

export function GetLocationName(props) {
    const { locations } = useSelector((store) => store);
    const obj = locations.find((loc) => loc.id == props.id);
    return obj.name;
}

export function Loader() {
    return (
        <div className="spinner">
            <div id="loading"></div>
        </div>
    );
}
