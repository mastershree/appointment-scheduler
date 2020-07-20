import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
//import { BrowserRouter as Router, Switch } from "react-router-dom";
//import { createBrowserHistory } from "history";
import rootReducer, { initialState } from "./reducers";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.scss";

//import "./fontawesome";

let init = initialState;

const persistedState = localStorage.getItem("appointment-scheduler");

if (persistedState) {
  init = JSON.parse(persistedState);
}

const store = createStore(rootReducer, init);

//console.log(JSON.stringify(store.getState()));

store.subscribe(() => {
  localStorage.setItem(
    "appointment-scheduler",
    JSON.stringify(store.getState())
  );
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
