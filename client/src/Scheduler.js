import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";
import { Jumbotron, Container, Card } from "reactstrap";
import { faCircle, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import SchedulerPanel from "./SchedulerPanel";

const mapStateToProps = (state) => {
  let { loggedUser, eventTypes } = state;

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

const Scheduler = (props) => {
  let { loggedUser, eventTypes } = props;

  console.log(loggedUser, eventTypes);

  /* let path=props.location.pathname;
  let loggedUser = { name: "Shrikant Gawas", email: "gawasshree@gmail.com" };
  let eventTypes = [
    { id: 1, title: "Demo Call", duration: 45 },
    { id: 3, title: "Team Meeting", duration: 45 },
    { id: 4, title: "Accout Review", duration: 60 },
  ];
  let path = "/appointments/shrikant-gawas-bookings/";
*/
  return (
    <div className="main">
      <Container style={{ margin: "10px 10px" }}>
        <h3>{loggedUser.name}</h3>
        <p>
          Welcome to my scheduling page. Please follow the instructions to add
          an event to my calender.
        </p>
        <Card style={{ width: "24rem", border: "none" }}>
          <ul>
            {eventTypes.length > 0 &&
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
                            pathname: `${props.location.pathname}/panel`,
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
};

export default connect(mapStateToProps, null)(Scheduler);
//export default Scheduler;
