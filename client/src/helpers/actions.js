import axios from "./axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { errorObj } from "../../../globalHelpers/helpers";

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
        console.log("Major Error in getting essential data:", err);
        return {
            type: "GET_ESSENTIAL_DATA",
            payload: errorObj("major", "Connection to the Server was lost"),
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
            // } else if (data.error) {
            //     toast.error(data.error.text);
        }
        return {
            type: "ADD_NEW_LOCATION",
            payload: data,
        };
    } catch (error) {
        console.log("Received an error on /locations:", error);
        // toast.error("Could not access Server");
        return {
            type: "ADD_NEW_LOCATION",
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
            payload: errorObj("component", "Could not access Server"),
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
            // } else if (data.error) {
            //     toast.error(data.error.text);
        }
        return {
            type: "CHANGE_LOCATION_RATING",
            payload: data,
        };
    } catch (error) {
        console.log("Received an error on /location:", error);
        // toast.error("Could not access Server");
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

export async function updateLocationSection(values, id, section) {
    const returnObj = { type: "UPDATE_LOCATION_SECTION", payload: {} };

    try {
        values.location_id = id;
        values.section_id = section;
        const { data } = await axios.post(
            "/in/updateLocationSection.json",
            values
        );
        returnObj.payload = data;
    } catch (error) {
        console.log("Received an error on /updateLocationSection:", error);
        returnObj.payload = errorObj(
            "notification",
            "Could not access the Server"
        );
    }

    return returnObj;
}

export async function voteLocationSection(section_id, vote) {
    console.log("ACTION:", section_id, vote);
    try {
        const result = await axios.post("/in/voteLocationSection.json", {
            section_id,
            vote,
        });
        console.log(result);
    } catch (error) {
        console.log("There was an error:", error);
    }
    return {
        type: "VOTE_LOCATION_SECTION",
    };
}

export function removeReduxDetail(section, value) {
    return {
        type: "REMOVE_REDUX_DETAIL",
        payload: {
            section,
            value,
        },
    };
}

export async function updatePicture(response, destination, id) {
    if (response.success) {
        toast.success(`Picture for ${destination} was changed succesfully`);
        // } else if (response.error) {
        //     toast.error(response.error.text);
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
            // } else if (data.error) {
            //     toast.error(data.error.text);
        }
        return {
            type: "UPDATE_USER_DATA",
            payload: data,
        };
    } catch (error) {
        // toast.error("No Server Connection");
        return {
            type: "UPDATE_USER_DATA",
            payload: {
                success: false,
                error: { type: "notification", text: "No Server Connection" },
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
            // } else {
            //     toast.error(data.error.text);
        }
        return {
            type: "UPDATE_TRIP_DATA",
            payload: data,
        };
    } catch (error) {
        console.log("error in updating Trip:", error);
        // toast.error("No Server Connection");
        return {
            type: "UPDATE_TRIP_DATA",
            payload: {
                success: false,
                error: { type: "notification", text: "No Server Connection" },
            },
        };
    }
}

export async function deleteTrip(id) {
    try {
        const { data } = await axios.get(`/in/deleteTrip.json?id=${id}`);
        if (data.success) {
            toast.success("Trip was successfully deleted");
            // } else {
            //     toast.error(data.error.text);
        }
        return {
            type: "DELETE_TRIP",
            payload: data,
        };
    } catch (error) {
        console.log("Error in deleting trip:", error);
        // toast.error("No Connection to Server");
        return {
            type: "DELETE_TRIP",
            payload: {
                success: false,
                error: { type: "notification", text: "No Server Connection" },
            },
        };
    }
}

export async function toggleTripStatus(id) {
    const obj = { type: "TOGGLE_TRIP_STATUS" };
    try {
        const { data } = await axios.patch("/in/tripStatus.json", { id });
        obj.payload = { id, ...data };
    } catch (error) {
        console.log(error);
        obj.payload.error = {
            type: "notification",
            text: "No Server Connection",
        };
    }
    console.log("returned OBJ:", obj.payload);
    if (obj.payload.success) {
        toast.success("Trip status changed");
        // } else {
        //     toast.error(obj.payload.error?.text);
    }
    return obj;
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
            // } else if (data.error) {
            //     toast.error(data.error.text);
        }
        return {
            type: "SUBMIT_FRIEND_ACTION",
            payload: data,
        };
    } catch (err) {
        console.log("axios error in fetching ");
        // toast.error("could not connect to Server");
        return {
            type: "SUBMIT_FRIEND_ACTION",
            payload: {
                success: false,
                error: {
                    type: "notification",
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
                    type: "notification",
                    text: "could not access Server",
                },
            },
        };
    }
}

export function newMessage(obj) {
    if (obj.success) {
        const {
            sender,
            recipient,
            username,
            trip_origin,
            location_id,
        } = obj.success;
        // gt toast if direct message or trip message to me and I am not on user page
        if (
            !location_id &&
            window.location.pathname != `/user/${sender}` &&
            window.location.pathname != `/user/${recipient}`
        ) {
            let text;
            if (!trip_origin) {
                text =
                    "Please manually select the chat group 'Direct Message'.";
            } else {
                text =
                    "Please manually select the chat group for the matching trip.";
            }

            toast(
                (t) => (
                    <span>
                        Got a new message from {username}.<br />
                        <Link to={`/user/${sender}`}>
                            <b
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    toast.success(text);
                                }}
                            >
                                go to profile
                            </b>
                        </Link>
                    </span>
                ),
                {
                    duration: 5000,
                    icon: "💬",
                }
            );
            obj = {};
        }
    } else {
        // toast.error(obj.error.text);
        obj = {};
    }
    return {
        type: "NEW_MESSAGE",
        payload: obj,
    };
}

export function markMessagesAsRead(arr) {
    return {
        type: "MARK_MESSAGES_AS_READ",
        payload: arr,
    };
}

export function activeUsers(arr) {
    return {
        type: "ACTIVE_USERS",
        payload: arr,
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
            // } else {
            //     toast.error(data.error.text);
        }
        return {
            type: "ADD_NEW_TRIP",
            payload: data,
        };
    } catch (error) {
        console.log("Error in adding Trip:", error);
        // toast.error("Could not access Server");
        return {
            type: "ADD_NEW_TRIP",
            error: { type: "notification", text: "Could not access Server" },
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
