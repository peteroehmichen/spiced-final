import { useSelector } from "react-redux";

export function onlineStatus(id, mode = "single") {
    const { activeUsers } = useSelector((store) => store);
    if (mode === "single") {
        return activeUsers && activeUsers.some((el) => el == id);
    } else {
        // TODO sum of online friends vs. total friends
        return;
    }
}

export default function OnlineSymbol(props) {
    let status = onlineStatus(props.id);
    const text = {
        fullText: ["online", "offline"],
        shortText: ["on", "off"],
        icons: ["🟢", "🔴"],
    };

    return (
        <div className={status ? "user-online" : "user-offline"}>
            {status
                ? text[props.style][0]
                : props.showOffline && text[props.style][1]}
        </div>
    );
}
