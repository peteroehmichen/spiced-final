import { useSelector } from "react-redux";

export default function OnlineStatus(props) {
    const { activeUsers } = useSelector((store) => store);
    let status = activeUsers && activeUsers.some((el) => el == props.id);

    return (
        <div className={status ? "user-online" : "user-offline"}>
            {status ? "online" : "offline"}
        </div>
    );
}
