import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  Button,
  FormGroup,
  FormFeedback,
  Table,
} from "reactstrap";
import validate from "./InputComponents/Validation";

class ResetPassword extends Component {
  state = {
    email: {
      value: "",
      placeholder: "Please enter your email id",
      touched: 0,
      valid: false,
      validationRules: {
        isRequired: true,
        isEmail: true,
      },
      errMsg: "Kindly re-enter youy correct email id",
    },
    submitted: false,
    completed: false,
    successMsg:
      "If that account is in our system, we emailed you a link to reset your password.",
    errMsg:
      "It seems, given email id is not present in the system. Kindly re-try using registered email id.",
  };

  handleChange = (e) => {
    let { email } = this.state;

    email.value = e.target.value;

    email.touched = 1;

    email.valid = validate(email.value, email.validationRules);

    this.setState({ email });
  };

  sendPasswordResetEmail = (e) => {
    e.preventDefault();
    const { email } = this.state;
    axios
      .post(`reset_password/user/${email.value}`)
      .then((res) =>
        this.setState({
          submitted: true,
          completed: true,
        })
      )
      .catch((err) => {
        this.setState((state) => ({
          ...state,
          email: { ...state.email, value: "", valid: false },
          submitted: true,
        }));
      });
  };

  render() {
    const { email, submitted, completed } = this.state;
    return (
      <div className="wrapper-reset-password">
        <div className="reset-password">
          <hr
            style={{
              marginTop: "2.5rem",
            }}
          />

          <div>
            {submitted && completed ? (
              <div
                className="confirmation"
                style={{
                  marginTop: "8rem",
                }}
              >
                <p>{this.state.successMsg}</p>
                <Link to="/" className="link">
                  Return to sign in
                </Link>
              </div>
            ) : (
              <div className="card">
                <Form className="form" onSubmit={this.sendPasswordResetEmail}>
                  <FormGroup>
                    <Input
                      type="email"
                      placeholder={email.placeholder}
                      value={email.value}
                      touched={email.touched}
                      valid={email.valid}
                      onChange={this.handleChange}
                    />
                    <FormFeedback
                      className={
                        email.touched === 1 && email.valid === false
                          ? "d-block"
                          : ""
                      }
                    >
                      {email.errMsg}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Button
                      type="submit"
                      className="submit-button"
                      disabled={!email.valid}
                    >
                      Submit
                    </Button>
                  </FormGroup>
                  <FormFeedback
                    className={
                      submitted === true && completed === false ? "d-block" : ""
                    }
                  >
                    {this.state.errMsg}
                  </FormFeedback>
                </Form>

                <Link to="/" className="link">
                  I remember my password
                </Link>
              </div>
            )}
          </div>

          <hr
            style={{
              top: "450px",
              position: "absolute",

              width: "25rem",
            }}
          />
        </div>
      </div>
    );
  }
}
export default ResetPassword;
