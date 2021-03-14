import { io } from "socket.io-client";
import { newMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("newMessageToClient", (obj) => {
        return store.dispatch(newMessage(obj));
    });
};

export function emitMessage(message) {
    socket.emit("newMessageToServer", message);
}
// export function emitFriendMessage(message) {
//     socket.emit("newFriendMessage", message);
// }
// export function emitTripMessage(message) {
//     socket.emit("newTripMessage", message);
// }
// export function emitLocationMessage(message) {
//     socket.emit("newLocationMessage", message);
// }
