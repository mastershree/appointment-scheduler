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

import CustomRoute from "./CustomRoute";
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
import { LOGOUT } from "./reducers";

const mapStateToProps = (state) => {
  //let [loggedUser] = state.users.filter((x) => x.isLoggedIn === true);

  console.log(state.isUserLogged);
  return { isUserLogged: state.isUserLogged, loggedUser: state.loggedUser };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => {
      // console.log("Set Login flag called");
      dispatch({ type: LOGOUT });
    },
  };
};

class App extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    let name = this.props.loggedUser.name;

    let cust = name.replace(/\s+/g, "-").toLowerCase();

    let customAppointmentLink = `/appointments/${cust}-bookings`;

    // mocked custome appointment link for testing Schedular
    //   let customAppointmentLink = "/appointments/shrikant-gawas-bookings";

    console.log(customAppointmentLink);
    return (
      <div>
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
                      {name.charAt(0)}
                    </span>
                    <span
                      style={{
                        color: "silver",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {name}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={this.props.logOut}>
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
            <Route exact path="/signup" component={Signup} />
            <CustomRoute
              exact
              path="/schedule"
              render={() => (
                <Schedule customAppointmentLink={customAppointmentLink} />
              )}
            />

            <CustomRoute
              exact
              //     isUserLogged={this.props.isUserLogged}
              path={customAppointmentLink}
              // MyComponent={(props) => <Scheduler {...props} />}
              component={Scheduler}
            />

            <CustomRoute
              exact
              path={`${customAppointmentLink}/panel`}
              component={SchedulerPanel}
            />

            <CustomRoute
              exact
              path="/event_type/edit/"
              component={EditEventType}
              //render={(props) => <EditEventType {...props} />}
            />

            <CustomRoute
              exact
              path="/event_type/create/"
              component={CreateEventType}
            />

            <Route exact path="/resetpassword" component={ResetPassword} />

            <Route
              exact
              path="*/password/reset/:email/:token"
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
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
