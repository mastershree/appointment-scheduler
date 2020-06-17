import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { render } from "node-sass";

const mapStateToProps = (state) => {
  let { loggedUser } = state;

  return { loggedUser };
};

class Upcoming extends Component {
  state = {
    data: [],
  };

  getUpcomingData = () => {
    axios
      .get(`/api/schedule_events/${this.props.loggedUser.email}`)
      .then((res) => {
        console.log(res);
        // this.setState({upcomingData: res.data});
      })
      .catch((err) => console.log);
  };

  render() {
    return <></>;
  }
}

export default connect(mapStateToProps, null)(Upcoming);
