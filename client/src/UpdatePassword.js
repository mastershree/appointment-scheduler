import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  FormFeedback,
  FormGroup,
  Label,
} from "reactstrap";
import validate from "./InputComponents/Validation";

class UpdatePassword extends Component {
  state = {
    form: {
      valid: false,
      touched: 0,
      submitted: false,
      successMsg: "Your password has been updated successfully",
      errMsg:
        "It seems there was some issue while updating password, kindly try once again!!!",
    },
    formControls: {
      password: {
        value: "",
        placeholder: "Please enter the password",
        valid: false,
        touched: 0,
        validationRules: {
          isRequired: true,
          minLength: 10,
        },
        errMsg: "Password must be at least 10 characters long",
        successMsg: "Entered password is valid",
      },
      confirmPassword: {
        value: "",
        placeholder: "Please re-enter the password",
        valid: false,
        touched: 0,
        validationRules: {
          isRequired: true,
          minLength: 10,
        },
        errMsg:
          "Entered password must match with previous one. Kindly enter same password as above.",
        successMsg: "Re-entered password matched",
      },
    },
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    let { form, formControls } = this.state;

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

    if (name === "confirmPassword" && updatedFormElement.valid === true) {
      let confirm = formControls.password.value === value ? true : false;
      updatedFormElement.valid = confirm;
    }

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

  updatePassword = (e) => {
    e.preventDefault();
    const { email, token } = this.props;
    const { password, confirmPassword } = this.state.formControls;
    let { form } = this.state;

    console.log(form);
    axios
      .post(`/reset_password/receive_new_password/${email}/${token}`, {
        password: password.value,
      })
      .then((res) => {
        console.log("RESPONSE FROM SERVER TO CLIENT:", res);
        form.touched = 0;
        if (res.status === 202) {
          this.setState({ form });
        }
      })
      .catch((err) => {
        console.log("SERVER ERROR TO CLIENT:", err);
        password.value = "";
        password.valid = false;
        password.touched = 0;
        confirmPassword.value = "";
        confirmPassword.valid = false;
        confirmPassword.touched = 0;
        form.valid = false;
        form.errMsg = err.response.data;
        this.setState({ form, password, confirmPassword });
      });
  };

  render() {
    const { form } = this.state;
    const { password, confirmPassword } = this.state.formControls;

    return (
      <div className="wrapper-update-password">
        <h5 className="title">Update Password</h5>

        {form.valid === true && form.touched === 0 ? (
          <div className="form-success">
            <p>{form.successMsg}</p>
            <Link to="/">Login</Link>
          </div>
        ) : (
          <Card body className="card">
            <Form onSubmit={this.updatePassword}>
              <FormGroup>
                <Label for="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password.value}
                  placeholder={password.placeholder}
                  touched={password.touched}
                  valid={password.valid}
                  onChange={this.handleChange}
                />
                <FormFeedback valid>{password.successMsg}</FormFeedback>
                <FormFeedback
                  className={
                    password.touched === 1 && password.valid === false
                      ? "d-block"
                      : ""
                  }
                >
                  {password.errMsg}
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword">Confirm Password:</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword.value}
                  placeholder={confirmPassword.placeholder}
                  touched={confirmPassword.touched}
                  valid={confirmPassword.valid}
                  onChange={this.handleChange}
                />
                <FormFeedback valid>{confirmPassword.successMsg}</FormFeedback>
                <FormFeedback
                  className={
                    confirmPassword.touched === 1 &&
                    confirmPassword.valid === false
                      ? "d-block"
                      : ""
                  }
                >
                  {confirmPassword.errMsg}
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Button
                  type="submit"
                  className="submit-button"
                  disabled={
                    form.valid === false ||
                    (form.valid === false && form.touched === 1)
                  }
                >
                  Update Password
                </Button>
              </FormGroup>
              <FormFeedback
                className={
                  form.valid === false && form.touched === 1 ? "d-block" : ""
                }
              >
                {form.errMsg}
              </FormFeedback>
            </Form>
          </Card>
        )}
      </div>
    );
  }
}

export default UpdatePassword;
