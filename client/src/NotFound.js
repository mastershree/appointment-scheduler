import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { isUserLogged: state.isUserLogged };
};

const Notfound = (props) => (
  <>{props.isUserLogged ? "" : <Redirect to="/" />}</>
);

export default connect(mapStateToProps)(Notfound);
