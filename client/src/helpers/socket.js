import { io } from "socket.io-client";
import { activeUsers, newMessage } from "./actions";
import toast from "react-hot-toast";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("newMessageToClient", (obj) => {
        return store.dispatch(newMessage(obj));
    });
    socket.on("error", (err) => {
        console.log("encountered an error", err);
    });
    socket.on("disconnect", () => {
        console.log("Socket Disconnected");
        toast.error("Lost the socket-connection to the server");
    });
    socket.on("connect_failed", function () {
        toast.error("connect:failed");
    });
    socket.on("connect", function () {
        toast.success("Websocket connection established");
    });
    socket.on("connecting", function () {
        toast.error("connecting");
    });
    socket.on("reconnect", function () {
        toast.error("reconnect");
    });
    socket.on("reconnecting", function () {
        toast.error("reconnecting");
    });
    socket.on("reconnect_failed", function () {
        toast.error("reconnect_failed");
    });

    socket.on("activeUsers", (arr) => {
        return store.dispatch(activeUsers(arr));
    });
};

export function emitMessage(message) {
    if (socket.connected) {
        socket.emit("newMessageToServer", message);
    } else {
        toast.error("No Connection - message was not sent");
    }
}

export function markAsRead(messages) {
    if (socket.connected) {
        socket.emit("markAsRead", messages);
    } else {
        toast.error("No Connection to server");
    }
}
