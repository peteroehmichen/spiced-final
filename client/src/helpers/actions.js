import axios from "./axios";
import toast from "react-hot-toast";

export async function getEssentialData() {
    try {
        const { data } = await axios.get(`/in/essentialData.json`);
        return {
            type: "GET_ESSENTIAL_DATA",
            payload: {
                ...data,
            },
        };
    } catch (err) {
        console.log("Major Error in fetching essential data:", err);
        return {
            type: "GET_ESSENTIAL_DATA",
            payload: {
                success: false,
                error: {
                    type: "major",
                    text: "Connection to Server was lost",
                },
            },
        };
    }
}

export function toggleLocationForm() {
    return { type: "TOGGLE_LOCATION_FORM" };
}

export async function toggleUploadModal() {
    return {
        type: "TOGGLE_UPLOAD_MODAL",
    };
}

export async function addNewLocation(values) {
    try {
        const { data } = await axios.get(
            `/in/addLocation.json?continent=${values.continent}&country=${values.country}&name=${values.name}`
        );
        if (data.success) {
            toast.success(
                `Location "${values.name.toUpperCase()}" was added succesfully`
            );
        } else if (data.error) {
            toast.error(data.error.text);
        }
        return {
            type: "ADD_NEW_LOCATION",
            payload: data,
        };
    } catch (error) {
        console.log("Received an error on /locations:", error);
        toast.error("Could not access Server");
        return {
            type: "ADD_NEW_LOCATION",
            payload: {
                success: false,
                error: {
                    type: "notifications",
                    text: "Could not access Server",
                },
            },
        };
    }
}

export async function getLocationData(id) {
    try {
        const { data } = await axios.get(`/in/locationData.json?id=${id}`);
        return {
            type: "FULL_LOCATION_DATA",
            payload: data,
        };
    } catch (error) {
        console.log("Received an error on /location:", error);
        return {
            type: "FULL_LOCATION_DATA",
            payload: {
                success: false,
                error: {
                    type: "notification",
                    text: "Could not access Server",
                },
            },
        };
    }
}

export async function changeMyRating(value, id) {
    try {
        const { data } = await axios.get(
            `/in/changeLocationRating.json?value=${value}&id=${id}`
        );
        if (data.success) {
            toast.success(`Your rating was updated succesfully`);
        } else if (data.error) {
            toast.error(data.error.text);
        }
        return {
            type: "CHANGE_LOCATION_RATING",
            payload: data,
        };
    } catch (error) {
        console.log("Received an error on /location:", error);
        toast.error("Could not access Server");
        return {
            type: "CHANGE_LOCATION_RATING",
            payload: {
                success: false,
                error: {
                    type: "notification",
                    text: "Could not access Server",
                },
            },
        };
    }

    // console.log("received:", data);
    // if (data.success) {
    //     return {
    //         payload: data.success,
    //         id,
    //     };
}

// export async function getLocationRating(id) {
//     const { data } = await axios.get(`/in/getLocationRating.json?q=${id}`);
//     // console.log("received:", data);
//     if (!data.error) {
//         return {
//             type: "GET_LOCATION_RATING",
//             payload: data.success,
//         };
//     } else {
//         return {
//             type: "GET_LOCATION_RATING",
//             error: data.error,
//         };
//     }
// }

export async function addLocationSection(values, id, prev) {
    values.id = id;
    if (prev.title) {
        values.prev = prev.title;
    }
    try {
        const { data } = await axios.post(
            "/in/addLocationSection.json",
            values
        );
        if (data.success) {
            toast.success("Location details updated");
        } else {
            toast.error(data.error.text);
        }
        return {
            type: "ADD_LOCATION_SECTION",
            payload: data,
        };
    } catch (error) {
        console.log("Received an error on /addLocationSection:", error);
        toast.error("Could not access Server");
        return {
            type: "ADD_LOCATION_SECTION",
            payload: {
                success: false,
                error: {
                    type: "notification",
                    text: "Could not access Server",
                },
            },
        };
    }
}

export async function updatePicture(response, destination, id) {
    if (response.success) {
        toast.success(`Picture for ${destination} was changed succesfully`);
    } else if (response.error) {
        toast.error(response.error.text);
    }
    return {
        type: "UPDATE_PICTURE",
        payload: {
            ...response,
            destination,
            id,
        },
    };
}

export async function updateUserData(values) {
    try {
        const { data } = await axios.post("/in/updateUserData.json", values);
        if (data.success) {
            toast.success(`Your profile data was successfully updated`);
        } else if (data.error) {
            toast.error(data.error.text);
        }
        return {
            type: "UPDATE_USER_DATA",
            payload: data,
        };
    } catch (error) {
        toast.error("No Server Connection");
        return {
            type: "UPDATE_USER_DATA",
            payload: {
                success: false,
                error: { type: "notifications", text: "No Server Connection" },
            },
        };
    }
}

export async function updateTripData(values, id, index) {
    values.id = id;
    try {
        const { data } = await axios.post("/in/updateTripData.json", values);
        if (data.success) {
            data.success.index = index;
            toast.success("Trip was successfully updated");
        } else {
            toast.error(data.error.text);
        }
        return {
            type: "UPDATE_TRIP_DATA",
            payload: data,
        };
    } catch (error) {
        console.log("error in updating Trip:", error);
        toast.error("No Server Connection");
        return {
            type: "UPDATE_TRIP_DATA",
            payload: {
                success: false,
                error: { type: "notifications", text: "No Server Connection" },
            },
        };
    }
}

export async function deleteTrip(id) {
    try {
        const { data } = await axios.get(`/in/deleteTrip.json?id=${id}`);
        if (data.success) {
            toast.success("Trip was successfully deleted");
        } else {
            toast.error(data.error.text);
        }
        return {
            type: "DELETE_TRIP",
            payload: data,
        };
    } catch (error) {
        console.log("Error in deleting trip:", error);
        toast.error("No Connection to Server");
        return {
            type: "DELETE_TRIP",
            payload: {
                success: false,
                error: { type: "notifications", text: "No Server Connection" },
            },
        };
    }
}

export async function getFriendships() {
    try {
        const { data } = await axios.get("/api/friends.json");
        return {
            type: "GET_FRIENDSHIPS",
            payload: data,
        };
    } catch (error) {
        console.log("Error in axios while fetching socials:", error);
        return {
            type: "GET_FRIENDSHIPS",
            payload: {
                success: false,
                error: { type: "module", text: "Could not connect to server" },
            },
        };
    }
}

export async function getUserData(id) {
    // console.log("Going to fetch user data:");
    try {
        const { data } = await axios.get(`/in/userData.json?id=${id}`);
        // console.log("received", data);
        return {
            type: "FULL_USER_DATA",
            payload: data,
        };
    } catch (err) {
        console.log("Received an error on /user:", err);
        return {
            type: "FULL_USER_DATA",
            payload: {
                success: false,
                error: { type: "essential", text: "No Connection to Database" },
            },
        };
    }
}

export async function submitFriendAction(id, task) {
    try {
        const { data } = await axios.post("/api/user/friendBtn.json", {
            friendId: id,
            task,
        });
        if (data.success) {
            if (task != "") {
                toast.success("Friendship status updated");
            }
            if (task == "Cancel Friendship" || task == "Accept Request") {
                data.success.toggleConfirmed = true;
            }
        } else if (data.error) {
            toast.error(data.error.text);
        }
        return {
            type: "SUBMIT_FRIEND_ACTION",
            payload: data,
        };
    } catch (err) {
        console.log("axios error in fetching ");
        toast.error("could not connect to Server");
        return {
            type: "SUBMIT_FRIEND_ACTION",
            payload: {
                success: false,
                type: {
                    type: "notifications",
                    text: "could not connect to Server",
                },
            },
        };
    }
}

export async function receiveChatMessages(about, id, limit = 20) {
    // console.log("asking server for chat data on", about, id);
    try {
        const { data } = await axios.get(
            `/in/chat.json?about=${about}&id=${id}&limit=${limit}`
        );
        // console.log("chats received:", data);
        return {
            type: "RECEIVE_CHAT_MESSAGES",
            payload: data,
        };
    } catch (error) {
        return {
            type: "RECEIVE_CHAT_MESSAGES",
            payload: {
                success: false,
                error: {
                    type: "notifications",
                    text: "could not access Server",
                },
            },
        };
    }
}

export function newMessage(obj) {
    return {
        type: "NEW_MESSAGE",
        payload: obj,
    };
}

////// unrevised actions /////

export function toggleTripForm() {
    return { type: "TOGGLE_TRIP_FORM" };
}

export async function toggleTripEdit(i) {
    return {
        type: "TOGGLE_TRIP_EDIT",
        index: i,
    };
}

export async function toggleTripUploadModal(id) {
    return {
        type: "TOGGLE_TRIP_UPLOAD_MODAL",
        payload: id,
    };
}

export async function addNewTrip(values) {
    try {
        const { data } = await axios.post(`/in/addTrip.json`, values);
        if (data.success) {
            toast.success(`new Trip was succesfully added`);
        } else {
            toast.error(data.error.text);
        }
        return {
            type: "ADD_NEW_TRIP",
            payload: data,
        };
    } catch (error) {
        console.log("Error in adding Trip:", error);
        toast.error("Could not access Server");
        return {
            type: "ADD_NEW_TRIP",
            error: { type: "notifications", text: "Could not access Server" },
        };
    }
}

export async function getLocations() {
    // console.log("getting all Locations");
    try {
        const { data } = await axios.get(`in/getLocations.json`);
        // console.log("response:", data);
        if (data.success) {
            return {
                type: "GET_LOCATIONS",
                payload: data.success,
            };
        } else {
            return {
                type: "GET_LOCATIONS",
                error: data.error,
            };
        }
    } catch (error) {
        return {
            type: "GET_LOCATIONS",
            error: "Could not retrieve Locations",
        };
    }
}

export async function getTrips() {
    // console.log("getting all Trips");
    try {
        const { data } = await axios.get(`/in/getTrips.json`);
        // console.log("response from getTrips:", data);
        if (data.success) {
            return {
                type: "GET_TRIPS",
                payload: data.success,
            };
        } else {
            return {
                type: "GET_TRIPS",
                error: data.error,
            };
        }
    } catch (error) {
        return {
            type: "GET_TRIPS",
            error: "Could not retrieve Trips",
        };
    }
}

/////////////////////////////////////////////
/////////////////////////////////////////////

export async function unfriend(id) {
    // console.log("Going to unfriend id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        task: "Cancel Friendship",
        friendId: id,
    });
    // console.log("received:", data);
    if (!data.error) {
        return {
            type: "CANCEL_FRIENDSHIP",
            payload: id,
        };
    }
}

export async function acceptRequest(id) {
    // console.log("Going to accept id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        task: "Accept Request",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "ACCEPT_REQUEST",
            payload: id,
        };
    }
}

export async function denyRequest(id) {
    // console.log("Going to deny id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        action: "Deny Request",
        task: id,
    });
    if (!data.error) {
        return {
            type: "DENY_REQUEST",
            payload: id,
        };
    }
}

export async function cancelRequest(id) {
    // console.log("Going to cancel id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        task: "Cancel Request",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "CANCEL_REQUEST",
            payload: id,
        };
    }
}

export async function findMatchingTrips() {
    try {
        const { data } = await axios.get("/in/matches.json");
        if (data.success) {
            return {
                type: "FIND_MATCHES",
                payload: data.success,
            };
        } else {
            return {
                type: "FIND_MATCHES",
                error: data.error,
            };
        }
    } catch (error) {
        console.log("Error while fetching matches:", error);
        return {
            type: "FIND_MATCHES",
            error: "Could not retrieve Matches",
        };
    }
}

/*
import axios from "./axios";
import { analyseMessages } from "./helpers";

export async function getList() {
    const { data } = await axios.get("/api/friends.json");
    // console.log("data from server", data);
    return {
        type: "GET_ALL_RELATIONS",
        payload: data,
    };
}

export async function unfriend(id) {
    // console.log("Going to unfriend id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        task: "Cancel Friendship",
        friendId: id,
    });
    console.log("received:", data);
    if (!data.error) {
        return {
            type: "CANCEL_FRIENDSHIP",
            payload: id,
        };
    }
}

export async function acceptRequest(id) {
    // console.log("Going to accept id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        task: "Accept Request",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "ACCEPT_REQUEST",
            payload: id,
        };
    }
}

export async function denyRequest(id) {
    // console.log("Going to deny id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        action: "Deny Request",
        task: id,
    });
    if (!data.error) {
        return {
            type: "DENY_REQUEST",
            payload: id,
        };
    }
}

export async function cancelRequest(id) {
    // console.log("Going to cancel id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        task: "Cancel Request",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "CANCEL_REQUEST",
            payload: id,
        };
    }
}

export async function getUserData(id) {
    // console.log("Going to fetch user data:");
    try {
        const { data } = await axios.get(`/api/user/data.json?id=${id}`);
        return {
            type: "FULL_USER_DATA",
            payload: data,
            id: id,
        };
    } catch (err) {
        console.log("Received an error on /user:", err);
        return {
            type: "FULL_USER_DATA",
            payload: { error: "No Connection to Database" },
            id: id,
        };
    }
}

export async function updateProfilePicture(response) {
    const obj = {
        type: "UPDATE_PROFILE_PICTURE",
    };
    if (response.url) {
        obj.payload = response.url;
    } else {
        obj.profilePicError = response.error;
    }

    return obj;
}

export async function toggleUploadModal() {
    // console.log("Going to fetch user data:");
    return {
        type: "TOGGLE_UPLOAD_MODAL",
    };
}

export async function toggleBioEditor() {
    // console.log("Going to fetch user data:");
    return {
        type: "TOGGLE_BIO_EDITOR",
    };
}

export async function updateBio(bio) {
    // console.log("Going to fetch user data:");

    try {
        const result = await axios.post("/api/profile-bio.json", {
            bio: bio,
        });
        if (result.data.update) {
            return {
                type: "UPDATE_BIO",
                payload: bio,
            };
        } else {
            return {
                type: "UPDATE_BIO",
                payload: { error: result.data.error },
            };
        }
    } catch (err) {
        console.log("there was an error in sending BIO:", err);
        return {
            type: "UPDATE_BIO",
            payload: { error: "Error in Connecting to Server" },
        };
    }
}

export async function submitFriendAction(id, task) {
    // console.log("friend BTN Run (ID, TASK):", id, task);
    try {
        const result = await axios.post("/api/user/friendBtn.json", {
            friendId: id,
            task: task,
        });
        // console.log("result from BTN Action:", result.data);
        return {
            type: "SUBMIT_FRIEND_ACTION",
            payload: {
                text: result.data.text,
                error: !!result.data.error,
            },
        };
    } catch (err) {
        return {
            type: "SUBMIT_FRIEND_ACTION",
            payload: {
                text: false,
                error: true,
            },
        };
    }
}

// receiving a single message
// receiving 10 messages caused my axios on starting <Chat />

export async function receiveChatMessages(user) {
    // console.log("asking server for chat data:");
    const { data } = await axios.get(`api/chat.json?q=${user}`);
    // console.log("data from AXIOS CHAT:", data);
    // const msgs = data.reverse();
    // console.log("FIXME - sorted chat messages:", data);
    if (!data.error) {
        // FIXME analyse messages
        const sorted = analyseMessages(data.reverse());
        // console.log("arr:", data);
        // console.log(Array.isArray(data));
        // sorted = data.reverse();
        // console.log("arr:", sorted);
        return {
            type: "RECEIVE_CHAT_MESSAGES",
            payload: sorted,
        };
    } else {
        return {
            type: "RECEIVE_CHAT_MESSAGES",
            error: data.error,
        };
    }
}

export function newChatMessage(obj) {
    // console.log("Got a new chat msg:", obj);
    return {
        type: "NEW_CHAT_MESSAGE",
        payload: obj,
    };
}

export function activeUsers(arr) {
    //
    // console.log("payload: ", arr);
    return {
        type: "ACTIVE_USERS",
        payload: arr,
    };
}

*/
