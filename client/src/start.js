import React from "react";
import ReactDOM from "react-dom";
import { init } from "./helpers/socket";

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import reducer from "./helpers/reducer";

import Welcome from "./out/Welcome";
import App from "./in/App";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
            <footer>Made with 🍐 by Peter Oehmichen, 2021</footer>
        </Provider>
    );
}

ReactDOM.render(
    <React.Fragment>{elem}</React.Fragment>,
    document.querySelector("main")
);
