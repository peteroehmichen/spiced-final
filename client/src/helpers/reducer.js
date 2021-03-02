export default function reducer(store = {}, action) {
    store = {
        ...store,
        user: {
            ...store.user,
        },
        otherUser: {
            ...store.otherUser,
        },
        location: {
            ...store.location,
        },
        rating: {
            ...store.rating,
        },
        tripEdit: {
            ...store.tripEdit,
        },
        locations: store.locations && [...store.locations],
        trips: store.trips && [...store.trips],
        grades: store.grades && [...store.grades],
        friendships: store.friendships && [...store.friendships],
        matches: store.matches && [...store.matches],
        chat: store.chat && [...store.chat],
    };

    if (action.type == "GET_ESSENTIAL_DATA") {
        if (action.payload.success) {
            // console.log("waiting to work...");
            store.user = action.payload.success.user;
            store.locations = action.payload.success.locations;
            // store.trips = action.payload.success.trips;
            store.grades = action.payload.success.grades;
            store.experience = action.payload.success.experience;
            store.countries = action.payload.success.countries;
            store.continents = action.payload.success.continents;
        } else {
            store.appError = action.error;
        }
    }

    if (action.type == "FULL_USER_DATA") {
        if (action.id == "0") {
            store.user = action.payload.user;
            store.grades = action.payload.grades;
        } else {
            store.otherUser = {
                ...store.otherUser,
                ...action.payload,
            };
        }
    }

    if (action.type == "FULL_LOCATION_DATA") {
        if (action.payload.error) {
            store.location = action.payload;
        } else {
            store.location = action.payload.success;
        }
    }

    if (action.type == "UPDATE_USER_DATA") {
        // console.log("reducer - updating...");
        // console.log(action.payload.success);
        // FIXME Error Handling
        store.updateError = action.payload.error;
        if (action.payload.success) {
            // console.log("adding to user...");
            store.user = {
                ...store.user,
                ...action.payload.success,
            };
            // console.log("new user:", store.user);
        }
    }

    if (action.type == "UPDATE_TRIP_DATA") {
        console.log("reducer - updating...");
        console.log(action.payload.success);
        store.updateError = action.payload.error;
        if (action.payload.success) {
            store.trips = store.trips.map((elem) => {
                console.log(elem.id, action.payload.success.id);
                if (elem.id == action.payload.success.id) {
                    console.log("reducer adding to trip...");
                    elem = action.payload.success;
                }
                return elem;
            });
            // console.log("new user:", store.user);
        }
    }

    if (action.type == "TOGGLE_LOCATION_FORM") {
        store.activeLocationForm = !store.activeLocationForm;
    }

    if (action.type == "TOGGLE_TRIP_FORM") {
        store.activeTripForm = !store.activeTripForm;
    }

    if (action.type == "TOGGLE_TRIP_EDIT") {
        console.log("reducer: toggling", action.index);
        store.tripEdit[action.index] = !store.tripEdit[action.index];

        // store.tripEdit = !store.tripEdit;
    }

    if (action.type == "TOGGLE_UPLOAD_MODAL") {
        store.activateUploadModal =
            store.activateUploadModal == null
                ? true
                : !store.activateUploadModal;
    }

    if (action.type == "TOGGLE_TRIP_UPLOAD_MODAL") {
        store.activateTripUploadModal = action.payload;
    }

    if (action.type == "TOGGLE_PROFILE_EDIT") {
        store.profileEdit = !store.profileEdit;
    }

    if (action.type == "TOGGLE_DESCRIPTION_EDIT") {
        store.descriptionEdit = !store.descriptionEdit;
    }

    if (action.type == "UPDATE_LOCATION_PICTURE") {
        if (action.payload) {
            store.location.picture = action.payload;
        } else {
            store.location.profilePicError = action.error;
        }
    }

    if (action.type == "UPDATE_PROFILE_PICTURE") {
        if (action.payload) {
            store.user.picture = action.payload;
        } else {
            store.user.profilePicError = action.error;
        }
    }

    if (action.type == "UPDATE_TRIP_PICTURE") {
        if (action.payload) {
            store.trips = store.trips.map((elem) => {
                if (elem.id == action.id) {
                    elem.picture = action.payload;
                }
                return elem;
            });
        } else {
            store.trip.profilePicError = action.error;
        }
    }

    if (action.type == "ADD_NEW_LOCATION") {
        // console.log("writing new Location to store");
        if (action.payload) {
            store.locations.unshift(action.payload);
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

    if (action.type == "GET_TRIPS") {
        // console.log("writing all Trips to store");
        if (action.payload) {
            store.trips = action.payload;
        } else {
            store.tripsError = action.error;
        }
    }

    if (action.type == "ADD_NEW_TRIP") {
        console.log("writing new trip to store");
        if (action.payload) {
            store.trips.unshift(action.payload);
        } else {
            store.tripsError = action.error;
        }
        store.activeTripForm = !store.activeTripForm;
    }

    if (action.type == "GET_FRIENDSHIPS") {
        store.friendships = action.payload;
    }

    if (action.type == "CANCEL_FRIENDSHIP") {
        store.friendships = store.friendships.filter(
            (user) => user.id != action.payload
        );
    }

    if (action.type == "ACCEPT_REQUEST") {
        store.friendships = store.friendships.map((user) => {
            if (user.sender == action.payload) {
                return {
                    ...user,
                    confirmed: true,
                };
            } else {
                return user;
            }
        });
    }

    if (action.type == "CANCEL_REQUEST") {
        store.friendships = store.friendships.filter(
            (user) => user.recipient != action.payload
        );
    }

    if (action.type == "DENY_REQUEST") {
        store.friendships = store.friendships.filter(
            (user) => user.sender != action.payload
        );
    }

    if (action.type == "SUBMIT_FRIEND_ACTION") {
        // console.log("payload:", action.payload);
        store.otherUser.nextFriendAction = action.payload.text;
        store.otherUser.dbError = action.payload.error;
    }

    if (action.type == "FIND_MATCHES") {
        // console.log("received:", action);
        store.matches = action.payload;
        store.matchesError = action.error;
    }

    if (action.type == "RECEIVE_CHAT_MESSAGES") {
        store.chat = action.payload;
        store.chatError = action.error;
    }

    if (action.type == "NEW_FRIEND_MESSAGE") {
        if (action.payload.error) {
            store.msgError = action.payload.error;
        } else {
            store.chat.push(action.payload);
            store.msgError = null;
        }
    }
    if (action.type == "NEW_TRIP_MESSAGE") {
        if (action.payload.error) {
            store.msgError = action.payload.error;
        } else {
            store.chat.push(action.payload);
            store.msgError = null;
        }
    }
    if (action.type == "NEW_LOCATION_MESSAGE") {
        if (action.payload.error) {
            store.msgError = action.payload.error;
        } else {
            store.chat.push(action.payload);
            store.msgError = null;
        }
    }
    if (action.type == "GET_LOCATION_RATING") {
        if (action.error) {
            store.ratingError = action.payload.error;
            store.rating = null;
        } else {
            store.rating = action.payload;
            store.ratingError = null;
        }
    }
    // if (action.type == "CHANGE_LOCATION_RATING") {
    //     if (action.error) {
    //         store.ratingError = action.payload.error;
    //         store.rating = null;
    //     } else {
    //         console.log(action.payload);
    //         // store.rating = action.payload;
    //         store.ratingError = null;
    //     }
    // }

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
