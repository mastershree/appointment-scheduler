import React, { Component } from "react";
import axios from "axios";

class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    errors: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  };

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  register = (event) => {
    event.preventDefault();
    let { errors, ...data } = this.state;
    let { confirm_password, ...user } = data;

    console.log(user);

    axios
      .post("api/user/register", user)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log("Error is ", err));
  };

  render() {
    return (
      <div>
        <p>SignUp Page</p>
        <form onSubmit={this.register}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter full name"
            onChange={this.handleChange}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email id"
            onChange={this.handleChange}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="Enter password"
            onChange={this.handleChange}
          />
          <br />
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="text"
            id="confirm_password"
            name="confirm_password"
            placeholder="Confirm password"
            onChange={this.handleChange}
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Signup;
