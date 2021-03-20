import { io } from "socket.io-client";
import { newMessage } from "./actions";
import toast from "react-hot-toast";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("newMessageToClient", (obj) => {
        return store.dispatch(newMessage(obj));
    });
    socket.on("error", () => {
        console.log("encountered an error");
    });
    socket.on("disconnect", () => {
        console.log("Socket Disconnected");
        toast.error("Lost the connection to the server");
    });
    socket.on("connect_failed", function () {
        toast.error("connect:failed");
    });
    socket.on("connect", function () {
        toast.success("connectio to Websocket established");
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
};

export function emitMessage(message) {
    if (socket.connected) {
        socket.emit("newMessageToServer", message);
    } else {
        toast.error("No Connection - message was not sent");
    }
}
