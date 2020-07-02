import React, { Component } from "react";
import axios from "axios";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  FormFeedback,
  Card,
} from "reactstrap";
import validate from "./InputComponents/Validation";
import { Link } from "react-router-dom";

class Signup extends Component {
  state = {
    form: {
      valid: false,
      touched: 0,
      successMsg: "You have been registered successfully",
      errMsg:
        "It seems there was some issue while creating account, kindly try once again!!!",
    },
    formControls: {
      name: {
        value: "",
        placeholder: "Please enter your full-name",
        valid: false,
        touched: 0,
        validationRules: {
          isRequired: true,
        },
        errMsg: "Your full-name is required",
        successMsg: "Entered name is valid",
      },
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
        successMsg: "Entered email id is valid",
      },
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

  register = (event) => {
    event.preventDefault();

    let { formControls, form } = this.state;
    let name = formControls.name;
    let email = formControls.email;
    let password = formControls.password;
    let confirmPassword = formControls.confirmPassword;
    let user = {
      name: name.value,
      email: email.value,
      password: password.value,
    };

    console.log(user);

    axios
      .post("api/user/register", user)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          name = { ...name, value: "", touched: 0, valid: false };
          email = { ...email, value: "", touched: 0, valid: false };
          password = { ...password, value: "", touched: 0, valid: false };
          confirmPassword = {
            ...confirmPassword,
            value: "",
            touched: 0,
            valid: false,
          };

          form = { ...form, touched: 0 };

          formControls = {
            ...formControls,
            name,
            email,
            password,
            confirmPassword,
          };

          this.setState({
            formControls,
            form,
          });
        }
      })
      .catch((err) => {
        console.log("Error encountered");
        name = { ...name, value: "", touched: 0, valid: false };
        email = { ...email, value: "", touched: 0, valid: false };
        password = { ...password, value: "", touched: 0, valid: false };
        confirmPassword = {
          ...confirmPassword,
          value: "",
          touched: 0,
          valid: false,
        };
        form = { ...form, valid: false, touched: 1 };

        formControls = {
          ...formControls,
          name,
          email,
          password,
          confirmPassword,
        };

        this.setState({
          formControls,
          form,
        });
        console.log("Data saved during error:", this.state);
      });
  };

  render() {
    let { name, email, password, confirmPassword } = this.state.formControls;
    let { form } = this.state;
    return (
      <div className="wrapper-signup">
        <Card body className="card">
          <p>SignUp Page</p>
          <Form onSubmit={this.register}>
            <FormGroup>
              <Label for="name">Name:</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name.value}
                placeholder={name.placeholder}
                touched={name.touched}
                valid={name.valid}
                onChange={this.handleChange}
              />
              <FormFeedback valid>{name.successMsg}</FormFeedback>
              <FormFeedback
                className={
                  name.touched === 1 && name.valid === false ? "d-block" : ""
                }
              >
                {name.errMsg}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="email">Email:</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email.value}
                placeholder={email.placeholder}
                touched={email.touched}
                valid={email.valid}
                onChange={this.handleChange}
              />
              <FormFeedback valid>{email.successMsg}</FormFeedback>
              <FormFeedback
                className={
                  email.touched === 1 && email.valid === false ? "d-block" : ""
                }
              >
                {email.errMsg}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password:</Label>
              <Input
                type="text"
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
                type="text"
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
                  (form.valid === false && form.touched === 0)
                }
              >
                Submit
              </Button>
            </FormGroup>
            {form.valid && form.touched === 0 ? (
              <p style={{ color: "green", marginTop: "1rem" }}>
                {" "}
                {form.successMsg}
              </p>
            ) : (
              ""
            )}

            <FormFeedback
              className={
                form.valid === false && form.touched === 1 ? "d-block" : ""
              }
            >
              {form.errMsg}
            </FormFeedback>
            <Link
              style={{
                marginTop: "1rem",
                display: "block",
                textAlign: "center",
              }}
              to="/"
            >
              Go to login page
            </Link>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Signup;
