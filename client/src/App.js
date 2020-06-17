import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";
import {
  Collapse,
  Navbar,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";

import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import UpdatePassword from "./UpdatePassword";
import Schedule from "./Schedule";
import EditEventType from "./EditEventType";
import CreateEventType from "./CreateEventType";

import Notfound from "./NotFound";

import "./App.css";
import Scheduler from "./Scheduler";
import SchedulerPanel from "./SchedulerPanel";
//import { SIGNUP } from "./reducers";
const CustomRoute = ({ isUserLogged, MyComponent, ...rest }) => {
  if (isUserLogged) {
    console.log(rest);
    return <Route render={MyComponent} {...rest} />;
  } else {
    return <Redirect to="/" />;
  }
};

const mapStateToProps = (state) => {
  //let [loggedUser] = state.users.filter((x) => x.isLoggedIn === true);

  console.log(state.isUserLogged);
  return { isUserLogged: state.isUserLogged, loggedUser: state.loggedUser };
};

class App extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    let name = this.props.loggedUser.name;

    let cust = name.replace(/\s+/g, "-").toLowerCase();

    let customAppointmentLink = `/app/appointments/${cust}-bookings`;

    // mocked custome appointment link for testing Schedular
    //   let customAppointmentLink = "/appointments/shrikant-gawas-bookings";

    console.log(customAppointmentLink);
    return (
      <>
        {this.props.isUserLogged ? (
          <Navbar
            color="dark"
            dark
            expand="md"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Collapse isOpen={this.state.isOpen} navbar>
              <NavbarText>
                <UncontrolledDropdown>
                  <DropdownToggle nav style={{ margin: 0, padding: 0 }}>
                    <span
                      style={{
                        display: "inline-block",
                        borderRadius: "50%",
                        border: "2px grey solid",
                        width: "35px",
                        height: "35px",
                        color: "black",
                        lineHeight: "35px",
                        textAlign: "center",
                        backgroundColor: "silver",
                        marginRight: "0.5rem",
                      }}
                    >
                      {this.props.loggedUser.name.charAt(0)}
                    </span>
                    <span
                      style={{
                        color: "silver",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {this.name}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={this.props.logout}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavbarText>
            </Collapse>
          </Navbar>
        ) : (
          ""
        )}
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/app/signup" component={Signup} />
            <CustomRoute
              exact
              path="/app/schedule"
              isUserLogged={this.props.isUserLogged}
              MyComponent={(props) => (
                <Schedule
                  customAppointmentLink={customAppointmentLink}
                  {...props}
                />
              )}
            />

            <Route
              exact
              //     isUserLogged={this.props.isUserLogged}
              path={customAppointmentLink}
              // MyComponent={(props) => <Scheduler {...props} />}
              component={Scheduler}
            />

            <Route
              exact
              path={`${customAppointmentLink}/panel`}
              component={SchedulerPanel}
            />

            <Route
              exact
              path="/app/event_type/edit/"
              component={EditEventType}
              //render={(props) => <EditEventType {...props} />}
            />

            <Route
              exact
              path="/app/event_type/create/"
              component={CreateEventType}
            />

            <Route exact path="/app/resetpassword" component={ResetPassword} />
            <Route
              exact
              path="/app/password/reset/:email/:token"
              render={({ match }) => (
                <UpdatePassword
                  email={match.params.email}
                  token={match.params.token}
                />
              )}
            />
            <Route component={Notfound} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default connect(mapStateToProps)(App);
