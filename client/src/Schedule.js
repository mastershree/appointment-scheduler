import React, { PureComponent } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { LOGOUT, LOAD_EVENT_TYPES } from "./reducers";
import Paginator from "./Paginator";
import { getEventTypes } from "./reducers";

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
} from "reactstrap";

const marginLeft = { marginLeft: "1rem" };

const navLink = { marginLeft: "1rem", textDecoration: "none" };

const marginRight = { marginRight: "1rem" };

const cardFooter = { backgroundColor: "white" };

const tabContent = { overflow: "auto" };

const mapStateToProps = (state) => {
  let { loggedUser } = state;
  let eventTypes = getEventTypes(state);
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

class Schedule extends PureComponent {
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
    console.log("user:", this.user);

    axios
      .get(`api/event_types/${this.user}`)
      .then((res) => {
        console.log(res.status);
        if (res.status === 200 && res.data.length > 0) {
          console.log("Yippie:", res.data);
          //    this.setState({ event_types: res.data });
          this.props.loadEventTypes(res.data);
        }
        console.log("Respone: ", res.data);
      })
      .catch((err) => console.log);
  };

  getUpcomingPastDataFromAPI = () => {
    console.log("Api called!!");

    axios
      .get(`api/schedule_events/${this.user}`)
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

  componentDidMount() {
    this.getEventTypesFromAPI();
    this.getUpcomingPastDataFromAPI();
  }

  componentWillUnmount() {
    console.log("Schedule unmounting");
  }

  render() {
    //  console.log(this.props.eventTypes);

    return (
      <div className="schedule-wrapper">
        <div>
          <span className="title">My Schedule</span>
          <div className="tab-container">
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
                <Row className="row">
                  <Col sm="12">
                    <div className="top-navigation">
                      {this.props.eventTypes &&
                        this.props.eventTypes.length > 0 && (
                          <p style={marginLeft}>
                            My Link <br />
                            <Link to={this.cust}>{this.cust}</Link>
                          </p>
                        )}
                      <Link
                        to={{
                          pathname: "/event_type/create",
                          user: this.user,
                        }}
                        style={navLink}
                      >
                        <Button outline color="primary" style={marginRight}>
                          + New Event Type
                        </Button>
                      </Link>
                    </div>
                    <hr />
                    <CardDeck className="cards-group">
                      {this.props.eventTypes && this.props.eventTypes.length > 0
                        ? this.props.eventTypes.map((event, index) => (
                            <Card body className="event_cards" key={index}>
                              <CardText>{event.title}</CardText>
                              <CardText>
                                <small className="text-muted">
                                  {event.duration} mins
                                </small>
                              </CardText>
                              <CardFooter style={cardFooter}>
                                <Link
                                  to={{
                                    pathname: "/event_type/edit",
                                    event: event,
                                  }}
                                >
                                  Edit
                                </Link>
                              </CardFooter>
                            </Card>
                          ))
                        : ""}
                    </CardDeck>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId={2} className="pane">
                <Row>
                  <Col sm="12">
                    <Card body className="card-body">
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
                        style={tabContent}
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
