import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SERVER_URI = "http://localhost:3001";

class UpdatePassword extends Component {
  state = {
    password: "",
    confirmPassword: "",
    submitted: false,
  };

  handleChange = (key) => (e) => {
    this.setState({ [key]: e.target.value });
  };

  updatePassword = (e) => {
    e.preventDefault();
    const { email, token } = this.props;
    const { password } = this.state;
    console.log(password);
    axios
      .post(
        `${SERVER_URI}/reset_password/receive_new_password/${email}/${token}`,
        { password }
      )
      .then((res) => console.log("RESPONSE FROM SERVER TO CLIENT:", res))
      .catch((err) => console.log("SERVER ERROR TO CLIENT:", err));
    this.setState({ submitted: !this.state.submitted });
  };

  render() {
    const { submitted } = this.state;

    return (
      <>
        {submitted ? (
          <div>
            <p>Your password has been saved.</p>
            <Link to="/">Login</Link>
          </div>
        ) : (
          <div>
            <form onSubmit={this.updatePassword}>
              <input
                onChange={this.handleChange("password")}
                value={this.state.password}
                placeholder="New password"
                type="password"
              />
              <input
                onChange={this.handleChange("confirmPassword")}
                value={this.state.confirmPassword}
                placeholder="Confirm password"
                type="password"
              />
              <button type="submit">Update Password</button>
            </form>
          </div>
        )}
      </>
    );
  }
}

export default UpdatePassword;
