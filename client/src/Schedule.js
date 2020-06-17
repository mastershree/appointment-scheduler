import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  withRouter,
} from "react-router-dom";
import { LOGOUT, LOAD_EVENT_TYPES } from "./reducers";
import Scheduler from "./Scheduler";
import ShowEventTypes from "./EventType/ShowEventTypes";
import CreateEventType from "./CreateEventType";
import Paginator from "./Paginator";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Card,
  CardText,
  Button,
  CardDeck,
  CardFooter,
  ButtonGroup,
} from "reactstrap";

const mapStateToProps = (state) => {
  let { loggedUser, eventTypes } = state;

  return { loggedUser, eventTypes };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      console.log("trigger logout");
      // console.log("Set Login flag called");
      dispatch({ type: LOGOUT });
    },
    loadEventTypes: (events) => {
      console.log("trigger load events");

      dispatch({ type: LOAD_EVENT_TYPES, payload: events });
    },
  };
};

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event_types: [],
      activeTab: 1,
      subActiveTab: 3,
      upcoming_events: [],
      past_events: [],
      perPage: 2,
    };
  }

  user = this.props.loggedUser.email;

  name = this.props.loggedUser.name;

  cust = this.props.customAppointmentLink;

  /*
  user = "gawasshree@gmail.com";

  name = "Shrikant Gawas";

  cust = "/appointments/shrikant-gawas-bookings";

  */

  setActiveTab = (value) => this.setState({ activeTab: value });

  setSubActiveTab = (value) => this.setState({ subActiveTab: value });

  getEventTypesFromAPI = () => {
    console.log("Api called!!");

    axios
      .get(`http://localhost:3001/api/event_types/${this.user}`)
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          this.setState({ event_types: res.data });
          this.props.loadEventTypes(res.data);
          //console.log("Respone: ", res.data);
        }
      })
      .catch((err) => console.log);
  };

  getUpcomingPastDataFromAPI = () => {
    console.log("Api called!!");

    axios
      .get(`http://localhost:3001/api/schedule_events/${this.user}`)
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          this.setState({
            upcoming_events: res.data.upcoming,
            past_events: res.data.past,
          });

          console.log("upcomingData Events:", this.state.upcoming_events);
        }
      })
      .catch((err) => console.log);
  };

  updateEventTypes = () => {
    this.getEventTypesFromAPI();
  };

  componentDidMount() {
    this.getEventTypesFromAPI();
    this.getUpcomingPastDataFromAPI();
  }

  render() {
    //  console.log(this.state.event_types);

    return (
      <div>
        <div style={{ margin: "50px 50px 50px 150px" }}>
          <span style={{ fontFamily: "Roboto Condensed", fontSize: "2rem" }}>
            My Schedule
          </span>
          <div style={{ marginTop: "20px", backgroundColor: "#F5F5F5" }}>
            <Nav tabs>
              <NavItem className={this.state.activeTab === 1 ? "active" : ""}>
                <NavLink onClick={() => this.setActiveTab(1)}>
                  Event Types
                </NavLink>
              </NavItem>
              <NavItem className={this.state.activeTab === 2 ? "active" : ""}>
                <NavLink onClick={() => this.setActiveTab(2)}>
                  Scheduled Events
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId={1} className="pane">
                <Row style={{ marginTop: "40px" }}>
                  <Col sm="12">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ marginLeft: "1rem" }}>
                        My Link <br />
                        <Link to={this.cust}>{this.cust}</Link>
                      </p>

                      <Link
                        to={{
                          pathname: "/app/event_type/create",
                          user: this.user,
                        }}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          outline
                          color="primary"
                          style={{ marginRight: "1rem" }}
                        >
                          + New Event Type
                        </Button>
                      </Link>
                    </div>
                    <hr />
                    <CardDeck style={{ marginTop: "2rem" }}>
                      {this.state.event_types &&
                        this.state.event_types.map((event, index) => (
                          <Card body className="event_cards" key={index}>
                            <CardText>{event.title}</CardText>
                            <CardText>
                              <small className="text-muted">
                                {event.duration} mins
                              </small>
                            </CardText>
                            <CardFooter style={{ backgroundColor: "white" }}>
                              <Link
                                to={{
                                  pathname: "/app/event_type/edit",
                                  event: event,
                                }}
                              >
                                Edit
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                    </CardDeck>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId={2} className="pane">
                <Row>
                  <Col sm="12">
                    <Card
                      body
                      style={{
                        width: "80%",
                        margin: "2rem 2rem 2rem 2rem",
                      }}
                    >
                      <Nav tabs>
                        <NavItem
                          className={
                            this.state.subActiveTab === 3 ? "active" : ""
                          }
                        >
                          <NavLink onClick={() => this.setSubActiveTab(3)}>
                            Upcoming
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={
                            this.state.subActiveTab === 4 ? "active" : ""
                          }
                        >
                          <NavLink onClick={() => this.setSubActiveTab(4)}>
                            Past
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent
                        activeTab={this.state.subActiveTab}
                        style={{
                          overflow: "auto",
                        }}
                      >
                        <TabPane tabId={3} className="pane">
                          <Row>
                            <Col>
                              {this.state.upcoming_events.length > 0 ? (
                                <Paginator
                                  data={this.state.upcoming_events}
                                  perPage={2}
                                />
                              ) : (
                                ""
                              )}
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId={4} className="pane">
                          <Row>
                            <Col>
                              {this.state.past_events.length > 0 ? (
                                <Paginator
                                  data={this.state.past_events}
                                  perPage={2}
                                />
                              ) : (
                                ""
                              )}
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
//export default Schedule;
