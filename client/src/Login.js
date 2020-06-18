import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Jumbotron,
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
//import history from "./history";
import { connect } from "react-redux";
import { LOGIN } from "./reducers";

const mapStateToProps = (state) => {
  let { loggedUser, isUserLogged } = state;

  return { loggedUser, isUserLogged };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoggedUser: (user) => {
      // console.log("Set Login flag called");
      dispatch({ type: LOGIN, payload: user });
    },
  };
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isError: {
        email: "",
        password: "",
        form: "",
      },
    };

    this.usrRef = React.createRef();
    this.pwdRef = React.createRef();
  }

  matchUser = (ip_email, ip_password) => {
    let data = { email: ip_email, password: ip_password };

    // let { history } = this.props;
    axios
      .post("/auth/login", data)
      .then((res) => {
        if (res.status === 200) {
          //console.log(res);
          this.props.setLoggedUser({ email: data.email, name: res.data.name });
          this.props.history.push("/app/schedule");
        }
      })
      .catch((err) => console.log);
  };

  onInputChange = (event) => {
    const { name, value } = event.target;

    let isError = {
      ...this.state.isError,
    };

    //console.log(isError);

    isError.form = "";

    switch (name) {
      case "email":
        isError.email = value.length > 0 ? "" : "Kindly enter your email id";
        break;
      case "password":
        isError.password = value.length > 0 ? "" : "Kindly enter your password";
        break;
      default:
        break;
    }

    this.setState({ isError, [name]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();

    console.log("Submit Clicked!!!");

    const { email, password } = this.state;

    let isError = { ...this.state.isError };

    isError.form = "";

    if (email.length === 0 && password === "") {
      isError.email = "Kindly enter your email id";
      isError.password = "Kindly enter your password";
    } else if (email.length === 0) {
      isError.username = "Kindly enter your email id";
    } else if (password === "") {
      isError.password = "Kindly enter your password";
    } else {
      this.matchUser(email, password);
    }
    //console.log(isError.form);
    this.setState({ isError });
  };

  render() {
    const { isError } = this.state;

    console.log(this.props.loggedUser);

    return (
      <>
        {this.props.isUserLogged ? (
          <Redirect to="/app/schedule" />
        ) : (
          <Jumbotron>
            <Container>
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email-id"
                    onChange={this.onInputChange}
                    invalid={isError.email.length > 0}
                  />
                  <FormFeedback invalid="{isError.email.length > 0}">
                    {isError.email}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={this.onInputChange}
                    invalid={isError.password.length > 0}
                  />
                  <FormFeedback invalid="{isError.password.length > 0}">
                    {isError.password}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Button type="submit">Submit</Button>
                  <FormFeedback invalid="{isError.form.length > 0}">
                    {isError.form}
                  </FormFeedback>
                </FormGroup>
              </Form>
            </Container>
          </Jumbotron>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
