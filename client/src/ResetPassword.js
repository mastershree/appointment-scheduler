import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SERVER_URI = "http://localhost:3001";

class ResetPassword extends Component {
  state = {
    email: "",
    submitted: false,
  };

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };

  sendPasswordResetEmail = (e) => {
    e.preventDefault();
    const { email } = this.state;
    axios.post(`${SERVER_URI}/reset_password/user/${email}`);
    this.setState({ email: "", submitted: true });
  };

  render() {
    const { email, submitted } = this.state;
    return (
      <>
        {submitted ? (
          <div>
            <p>
              If that account is in our system, we emailed you a link to reset
              your password.
            </p>
            <Link to="/">Return to sign in</Link>
          </div>
        ) : (
          <div>
            <form onSubmit={this.sendPasswordResetEmail}>
              <input
                type="text"
                value={email}
                placeholder="Enter your email-id"
                onChange={this.handleChange}
              />
              <button type="submit">Submit</button>
            </form>
            <Link to="/">I remember my password</Link>
          </div>
        )}
      </>
    );
  }
}
export default ResetPassword;
