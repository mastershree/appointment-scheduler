import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Jumbotron,
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
//import history from "./history";
import { connect } from "react-redux";
import { LOGIN } from "./reducers";
import TextInput from "./InputComponents/TextInput";
import validate from "./InputComponents/Validation";

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
      form: {
        valid: false,
        touched: 0,
        errMsg: "Provided credentials are not correct. Please try again!!!",
      },
      formControls: {
        email: {
          value: "",
          placeholder: "Please enter your email id",
          valid: false,
          touched: 0,
          validationRules: {
            isRequired: true,
            isEmail: true,
          },
          errMsg: "Please enter correct email id",
        },
        password: {
          value: "",
          placeholder: "Please enter your password",
          valid: false,
          touched: 0,
          validationRules: {
            isRequired: true,
          },
          errMsg: "Please re-enter your password",
        },
      },
    };
  }

  changeHandler = (e) => {
    const { name, value } = e.target;

    let { form } = this.state;

    const updatedControls = {
      ...this.state.formControls,
    };

    const updatedFormElement = {
      ...updatedControls[name],
    };

    updatedFormElement.value = value;
    updatedFormElement.touched = 1;
    updatedFormElement.valid = validate(
      value,
      updatedFormElement.validationRules
    );

    updatedControls[name] = updatedFormElement;

    form.valid = true;
    form.touched = 1;

    for (let inputIdentifier in updatedControls) {
      form.valid = updatedControls[inputIdentifier].valid && form.valid;
      if (form.valid === false) {
        form.touched = 0;
      }
    }

    this.setState({
      formControls: updatedControls,
      form,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();

    console.log("Submit Clicked!!!");

    const { formControls, form } = this.state;
    let email = formControls.email;
    let password = formControls.password;
    axios
      .post("/auth/login", { email: email.value, password: password.value })
      .then((res) => {
        if (res.status === 200) {
          //console.log(res);

          this.props.setLoggedUser({
            email: email.value,
            name: res.data.name,
          });
          this.props.history.push("/schedule");
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          email.value = "";
          email.valid = false;
        }
        password.value = "";
        password.valid = false;
        form.valid = false;
        form.errMsg = `<p><span>Error Code:</span> ${err.response.status} </br> <span>Message:</span> ${err.response.data}</p>`;
        this.setState({ form, email, password });
        console.log(this.state.form);
      });

    //console.log(isError.form);
  };

  render() {
    const { form } = this.state;
    let { email, password } = this.state.formControls;

    console.log(this.props.loggedUser);

    return (
      <>
        {this.props.isUserLogged ? (
          <Redirect to="/schedule" />
        ) : (
          <div className="wrapper">
            <div className="login-container">
              <Card body className="login">
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder={email.placeholder}
                      value={email.value}
                      touched={email.touched}
                      valid={email.valid}
                      onChange={this.changeHandler}
                    />
                    <FormFeedback
                      invalid="{formControls.email.touched===1 && 
                      formControls.email.valid===false}"
                    >
                      {email.errMsg}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder={password.placeholder}
                      value={password.value}
                      touched={password.touched}
                      valid={password.valid}
                      onChange={this.changeHandler}
                    />
                    <FormFeedback
                      invalid="{formControls.password.touched===1 && 
                      formControls.password.valid===false}"
                    >
                      {password.errMsg}
                    </FormFeedback>
                  </FormGroup>

                  <Button
                    className="submit-button"
                    type="submit"
                    disabled={!form.valid}
                  >
                    Submit
                  </Button>

                  <Link className="link" to="/resetpassword">
                    Forgot Password
                  </Link>
                  <br />
                  <br />
                  <Link to="/signup" className="link">
                    Don't have Account, click here !!!
                  </Link>
                </Form>

                <p
                  className={
                    form.touched === 1 && form.valid === false
                      ? "form-error"
                      : ""
                  }
                  dangerouslySetInnerHTML={{
                    __html:
                      form.touched === 1 && form.valid === false
                        ? form.errMsg
                        : "",
                  }}
                />
              </Card>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
