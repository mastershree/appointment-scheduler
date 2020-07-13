import React, { PureComponent } from "react";

import { connect } from "react-redux";
import { Container, Card } from "reactstrap";
import { faCircle, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getEventTypes } from "./reducers";

const mapStateToProps = (state) => {
  let { loggedUser } = state;
  let eventTypes = getEventTypes(state);
  return { loggedUser, eventTypes };
};

/*
const mapDispatchToProps = (dispatch) => {
  return {
    loadEventTypes: (events) => {
      console.log("trigger load events");

      dispatch({ type: LOAD_EVENT_TYPES, payload: events });
    },
  };
};
*/

class Scheduler extends PureComponent {
  /* let path=props.location.pathname;
  let loggedUser = { name: "Shrikant Gawas", email: "gawasshree@gmail.com" };
  let eventTypes = [
    { id: 1, title: "Demo Call", duration: 45 },
    { id: 3, title: "Team Meeting", duration: 45 },
    { id: 4, title: "Accout Review", duration: 60 },
  ];
  let path = "/appointments/shrikant-gawas-bookings/";
*/
  render() {
    let { loggedUser, eventTypes } = this.props;

    console.log(loggedUser, eventTypes);

    return (
      <div className="scheduler-wrapper">
        <Container style={{ margin: "10px 10px" }}>
          <h3>{loggedUser.name}</h3>
          <p>
            Welcome to my scheduling page. Please follow the instructions to add
            an event to my calender.
          </p>
          <Card style={{ width: "24rem", border: "none" }}>
            <ul>
              {eventTypes &&
                eventTypes.length > 0 &&
                eventTypes.map((et) => (
                  <div key={et.id}>
                    <hr />
                    <li>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <FontAwesomeIcon
                            icon={faCircle}
                            style={{ color: "#7B68EE", marginRight: "10px" }}
                          />
                          {et.title}
                        </span>
                        <span>
                          <Link
                            to={{
                              pathname: `${this.props.location.pathname}/panel`,
                              user: loggedUser,
                              event: et,
                            }}
                          >
                            <FontAwesomeIcon icon={faCaretRight} />
                          </Link>
                        </span>
                      </p>
                    </li>
                  </div>
                ))}
            </ul>
          </Card>
        </Container>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Scheduler);
//export default Scheduler;
