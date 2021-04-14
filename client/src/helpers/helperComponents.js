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

export function parseQuery(queryString) {
    if (typeof queryString != "string" || queryString.length == 0) {
        return {};
    }
    if (queryString[0] === "?") {
        queryString = queryString.slice(1);
    }
    const queries = queryString.split("&");
    let obj = {};
    for (let i = 0; i < queries.length; i++) {
        let element = queries[i].split("=");
        let key = decodeURIComponent(element[0]);
        let value = decodeURIComponent(element[1]);

        if (key.length == 0) continue;

        if (typeof obj[key] == "undefined") {
            obj[key] = value;
        } else if (obj[key] instanceof Array) {
            obj[key].push(value);
        } else {
            obj[key] = [obj[key], value];
        }
    }
    return obj;
}
