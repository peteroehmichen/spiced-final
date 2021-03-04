import { io } from "socket.io-client";
import {
    newFriendMessage,
    newLocationMessage,
    newTripMessage,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("newFriendMsg", (obj) => {
        console.log("new FriendMSG", obj);
        return store.dispatch(newFriendMessage(obj));
    });
    socket.on("newTripMsg", (obj) => {
        console.log("new TripMSG", obj);
        return store.dispatch(newTripMessage(obj));
    });
    socket.on("newLocationMsg", (obj) => {
        console.log("new LocationMSG", obj);
        return store.dispatch(newLocationMessage(obj));
    });

    // socket.on("activeUsers", (arr) => {
    //     // console.log("Users:", arr);
    //     return store.dispatch(activeUsers(arr));
    // });
};

export function emitFriendMessage(message) {
    socket.emit("newFriendMessage", message);
}
export function emitTripMessage(message) {
    socket.emit("newTripMessage", message);
}
export function emitLocationMessage(message) {
    socket.emit("newLocationMessage", message);
}
