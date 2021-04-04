import { useSelector } from "react-redux";

export function onlineStatus(id) {
    const { activeUsers } = useSelector((store) => store);
    return activeUsers && activeUsers.some((el) => el == id);
}

export default function OnlineSymbol(props) {
    let status = onlineStatus(props.id);

    return (
        <div className={status ? "user-online" : "user-offline"}>
            {status ? "online" : "offline"}
        </div>
    );
}
