import { produce } from "immer";
import toast from "react-hot-toast";

export default function reducer(store = {}, action) {
    ///////////////////////////////////////////////////
    // changing complex and/or nested values with immer
    ///////////////////////////////////////////////////

    if (action.type == "GET_ESSENTIAL_DATA") {
        return produce(store, (newStore) => {
            const { success, error } = action.payload;
            if (success) {
                // newStore = {
                //     ...newStore,
                //     ...success,
                // };
                newStore.user = success.user;
                newStore.locations = success.locations;
                newStore.trips = success.trips;
                newStore.matches = success.matches;
                newStore.grades = success.grades;
                newStore.experience = success.experience;
                newStore.location_topics = success.location_topics;
                newStore.countries = success.countries;
                newStore.continents = success.continents;
                newStore.friendships = success.friendships;
            } else {
                newStore.errors = {
                    [error.type]: error.text,
                };
            }
        });
    }

    if (action.type == "ADD_NEW_TRIP") {
        return produce(store, (newStore) => {
            if (action.payload.success) {
                newStore.trips.unshift(action.payload.success);
                newStore.activeTripForm = !store.activeTripForm;
            }
        });
    }

    if (action.type == "ADD_NEW_LOCATION") {
        return produce(store, (newStore) => {
            if (action.payload.success) {
                newStore.locations.unshift(action.payload.success);
                newStore.activeLocationForm = !store.activeLocationForm;
            }
        });
    }

    if (action.type == "FULL_LOCATION_DATA") {
        return produce(store, (newStore) => {
            if (action.payload.success) {
                newStore.location = action.payload.success;
            } else {
                newStore.location.error = action.payload.error.text;
            }
        });
    }

    if (action.type == "ADD_LOCATION_SECTION") {
        return produce(store, (newStore) => {
            if (action.payload.success) {
                if (newStore.location.id == action.payload.success.id) {
                    newStore.location.infos = action.payload.success.infos;
                }
            }
        });
    }

    if (action.type == "CHANGE_LOCATION_RATING") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            if (success && success.location_id == newStore.location.id) {
                newStore.location.own = success.own;
                newStore.location.sum = success.sum;
                newStore.location.avg = success.avg;
                newStore.locations.forEach((country) => {
                    if (country.id == success.location_id) {
                        country.avg = success.avg;
                    }
                    return country;
                });
            }
        });
    }

    if (action.type == "UPDATE_PICTURE") {
        const { destination, id, success } = action.payload;
        return produce(store, (newStore) => {
            if (success) {
                if (destination == "location") {
                    if (id == newStore.location.id) {
                        newStore.location.picture = success.url;
                        newStore.locations.forEach((country) => {
                            if (country.id == id) {
                                country.picture = success.url;
                            }
                            return country;
                        });
                    }
                } else if (destination == "trip") {
                    newStore.trips.forEach((trip) => {
                        if (trip.id == id) {
                            trip.picture = success.url;
                        }
                        return trip;
                    });
                    newStore.activateTripUploadModal = false;
                } else if (destination == "profile") {
                    if (id == newStore.user.id) {
                        newStore.user.picture = success.url;
                    }
                }

                newStore.activateUploadModal = false;
            }
        });
    }

    if (action.type == "UPDATE_USER_DATA") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            if (success && success.id == newStore.user.id) {
                newStore.user = success;
            }
        });
    }

    if (action.type == "UPDATE_TRIP_DATA") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            if (success) {
                newStore.tripEdit[success.index] = false;
                delete success.index;
                newStore.trips = newStore.trips.map((trip) => {
                    if (trip.id == success.id) {
                        trip = success;
                    }
                    return trip;
                });
            }
        });
    }

    if (action.type == "DELETE_TRIP") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            if (success) {
                newStore.trips = newStore.trips.filter(
                    (trip) => trip.id != success.id
                );
            }
        });
    }

    if (action.type == "FULL_USER_DATA") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            if (success) {
                newStore.otherUser = {
                    ...newStore.otherUser,
                    ...success,
                };
            }
        });
    }

    if (action.type == "SUBMIT_FRIEND_ACTION") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            if (success) {
                newStore.otherUser = {
                    ...newStore.otherUser,
                    nextFriendAction: success.text,
                };
                if (success.toggleConfirmed) {
                    newStore.otherUser.confirmed = !newStore.otherUser
                        .confirmed;
                }
            }
        });
    }

    if (action.type == "RECEIVE_CHAT_MESSAGES") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            delete newStore.chat;
            if (success) {
                newStore.chat = success;
            }
        });
    }

    if (action.type == "NEW_MESSAGE") {
        const { success } = action.payload;
        return produce(store, (newStore) => {
            if (success) {
                newStore.chat.push(success);
            }
        });
    }

    if (action.type == "MARK_MESSAGES_AS_READ") {
        return produce(store, (newStore) => {
            if (newStore.chat) {
                newStore.chat.forEach((m) => {
                    if (action.payload.includes(m.id)) {
                        m.read_by_recipient = true;
                    }
                });
            }
        });
    }

    if (action.type == "REMOVE_REDUX_DETAIL") {
        return produce(store, (newStore) => {
            newStore[action.payload.section] = action.payload.value;
        });
    }

    if (action.type == "ACTIVE_USERS") {
        return produce(store, (newStore) => {
            newStore.activeUsers = action.payload;

            const { activeUsers: prevActiveUsers, friendships } = store;
            if (prevActiveUsers && friendships) {
                prevActiveUsers.forEach((userId) => {
                    if (!action.payload.includes(userId)) {
                        friendships.forEach((friend) => {
                            if (friend.id == userId && friend.confirmed) {
                                toast.success(
                                    `${friend.first} ${friend.last} just went offline`
                                );
                                return;
                            }
                        });
                    }
                });

                action.payload.forEach((userId) => {
                    if (!prevActiveUsers.includes(userId)) {
                        friendships.forEach((friend) => {
                            if (friend.id == userId && friend.confirmed) {
                                toast.success(
                                    `${friend.first} ${friend.last} just came online`
                                );
                                return;
                            }
                        });
                    }
                });
            }
        });
    }

    ////////////////////////////////////////////////////////
    // changing primitive values on base level without immer
    ////////////////////////////////////////////////////////

    if (action.type == "TOGGLE_LOCATION_FORM") {
        return (store = {
            ...store,
            activeLocationForm: !store.activeLocationForm,
        });
    }

    if (action.type == "TOGGLE_UPLOAD_MODAL") {
        return (store = {
            ...store,
            activateUploadModal: !store.activateUploadModal,
        });
    }

    ////////////////////////////////////////////////////////

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
        experience: store.experience && [...store.experience],
        countries: store.countries && [...store.countries],
        continents: store.continents && [...store.continents],
        friendships: store.friendships && [...store.friendships],
        matches: store.matches && [...store.matches],
        chat: store.chat && [...store.chat],
    };

    if (action.type == "TOGGLE_TRIP_FORM") {
        store.activeTripForm = !store.activeTripForm;
    }

    if (action.type == "TOGGLE_TRIP_EDIT") {
        store.tripEdit[action.index] = !store.tripEdit[action.index];
    }

    if (action.type == "TOGGLE_TRIP_UPLOAD_MODAL") {
        store.activateTripUploadModal = action.payload;
    }

    if (action.type == "GET_LOCATIONS") {
        if (action.payload) {
            store.locations = action.payload;
        } else {
            store.locationError = action.error;
        }
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

    if (action.type == "FIND_MATCHES") {
        // console.log("received:", action);
        store.matches = action.payload;
        store.matchesError = action.error;
    }

    ///////////////////////////////////////////////////////
    // actions that should be irrelevant

    if (action.type == "GET_TRIPS") {
        if (action.payload) {
            store.trips = action.payload;
        } else {
            store.tripsError = action.error;
        }
    }

    return store;
}
