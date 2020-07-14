import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { isUserLogged: state.isUserLogged };
};

const CustomRoute = ({ isUserLogged, ...rest }) => {
  if (isUserLogged) {
    console.log(rest);
    return <Route {...rest} />;
  } else {
    return <Redirect to="/" />;
  }
};

export default connect(mapStateToProps)(CustomRoute);
