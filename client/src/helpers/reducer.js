export default function reducer(store = {}, action) {
    store = {
        ...store,
        user: {
            ...store.user,
        },
        otherUser: {
            ...store.otherUser,
        },
        locations: store.locations && [...store.locations],
        grades: store.grades && [...store.grades],
    };

    if (action.type == "FULL_USER_DATA") {
        if (action.id == "0") {
            store.user = action.payload.user;
            store.gardes = action.payload.grades;
        } else {
            store.otherUser = {
                ...store.otherUser,
                ...action.payload,
            };
        }
    }

    if (action.type == "UPDATE_USER_DATA") {
        console.log("reducer - updating...");
        // FIXME Error Handling
        store.user = {
            ...store.user,
            ...action.payload,
        };
    }

    if (action.type == "TOGGLE_LOCATION_FORM") {
        store.activeLocationForm = !store.activeLocationForm;
    }

    if (action.type == "ADD_NEW_LOCATION") {
        // console.log("writing new Location to store");
        if (action.payload) {
            store.locations = store.locations.concat(action.payload);
        } else {
            store.locationError = action.error;
        }
        store.activeLocationForm = !store.activeLocationForm;
    }

    if (action.type == "GET_LOCATIONS") {
        // console.log("writing all Locations to store");
        if (action.payload) {
            store.locations = action.payload;
        } else {
            store.locationError = action.error;
        }
    }

    return store;
}

/*

export default function reducer(store = {}, action) {
    if (action.type == "GET_ALL_RELATIONS") {
        store = {
            ...store,
            relations: action.payload,
        };
    }

    if (action.type == "CANCEL_FRIENDSHIP") {
        store = {
            ...store,
            relations: store.relations.filter(
                (user) => user.id != action.payload
            ),
        };
    }

    if (action.type == "ACCEPT_REQUEST") {
        store = {
            ...store,
            relations: store.relations.map((user) => {
                if (user.sender == action.payload) {
                    return {
                        ...user,
                        confirmed: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "CANCEL_REQUEST") {
        store = {
            ...store,
            relations: store.relations.filter(
                (user) => user.recipient != action.payload
            ),
        };
    }

    if (action.type == "DENY_REQUEST") {
        store = {
            ...store,
            relations: store.relations.filter(
                (user) => user.sender != action.payload
            ),
        };
    }

    if (action.type == "FULL_USER_DATA") {
        // console.log("calling Full User Data");
        store = {
            ...store,
            user: {
                ...store.user,
            },
            otherUser: {
                ...store.otherUser,
            },
        };
        if (!action.payload.profilePicUrl) {
            action.payload.profilePicUrl = "/default.jpg";
        }
        if (action.id == "0") {
            store.user = action.payload;
            store.activeBioEditor = false;
        } else {
            store.otherUser = {
                ...store.otherUser,
                ...action.payload,
            };
        }
    }

    if (action.type == "UPDATE_PROFILE_PICTURE") {
        //
        store = {
            ...store,
            user: {
                ...store.user,
            },
            otherUser: {
                ...store.otherUser,
            },
        };
        if (action.payload) {
            store.user.profilePicUrl = action.payload;
        } else {
            store.user.profilePicError = action.error;
        }
    }

    if (action.type == "TOGGLE_UPLOAD_MODAL") {
        store = {
            ...store,
            user: {
                ...store.user,
            },
            activateUploadModal:
                store.activateUploadModal == null
                    ? true
                    : !store.activateUploadModal,
        };
    }

    

    if (action.type == "UPDATE_BIO") {
        // maybe handle errors and thik about handling loading
        store = {
            ...store,
            user: {
                ...store.user,
            },
        };
        if (action.payload.error) {
            store.user.bioError = action.payload.error;
        } else {
            store.user.bio = action.payload;
            store.user.bioError = null;
        }
    }

    if (action.type == "SUBMIT_FRIEND_ACTION") {
        // console.log("payload:", action.payload);
        store = {
            ...store,
            user: {
                ...store.user,
            },
            otherUser: {
                ...store.otherUser,
            },
        };
        store.otherUser.nextFriendAction = action.payload.text;
        store.otherUser.dbError = action.payload.error;
    }

    if (action.type == "RECEIVE_CHAT_MESSAGES") {
        // console.log("adding 10 chat Messages...");
        store = {
            ...store,
            user: {
                ...store.user,
            },
            otherUser: {
                ...store.otherUser,
            },
            chatError: action.error,
            chat: action.payload || [],
        };
    }

    if (action.type == "NEW_CHAT_MESSAGE") {
        // console.log("adding new Message:", action.payload);
        store = {
            ...store,
            user: {
                ...store.user,
            },
            otherUser: {
                ...store.otherUser,
            },
            chat: [...store.chat],
        };
        if (action.payload.error) {
            store.msgError = action.payload.error;
        } else {
            store.chat.push(action.payload);
            store.chat = analyseMessages(store.chat);
            store.msgError = null;
        }
    }

    if (action.type == "ACTIVE_USERS") {
        store = {
            ...store,
            user: {
                ...store.user,
            },
            otherUser: {
                ...store.otherUser,
            },
            chat: store.chat ? [...store.chat] : [],
        };
        store.activeUsers = action.payload;
    }

    return store;
}


*/
