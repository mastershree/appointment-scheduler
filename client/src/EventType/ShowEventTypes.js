import React, { Component } from "react";
import { Link } from "react-router-dom";
//import { connect } from "react-redux";

class ShowEventTypes extends Component {
  render() {
    // console.log(Array.isArray(this.state.event_types));
    let user = this.props.user;
    return (
      <>
        <ul>
          {this.props.event_types.map((et, id) => (
            <li key={id}>
              <div>
                <p>
                  {et.title} {et.duration}{" "}
                </p>
                <p>
                  <Link
                    to={{
                      pathname: "/event_type/edit",
                      eventType: et,
                      user: user,
                    }}
                  >
                    Edit
                  </Link>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
export default ShowEventTypes;
