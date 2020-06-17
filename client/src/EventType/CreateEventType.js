import React, { Component } from "react";
import axios from "axios";

class CreateEventType extends Component {
  state = {
    title: "",
    duration: "",
  };

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  create = (event) => {
    event.preventDefault();
    let { title, duration } = this.state;
    let user = this.props.user;
    axios
      .post("http://localhost:3001/api/event_type/create", {
        title,
        duration,
        user,
      })
      .then((res) => {
        if (res.status === 200) {
          this.props.updateEventTypes();
          console.log("Event type created successfully", res);
        }
      })
      .catch((err) => console.log);
  };

  render() {
    return (
      <>
        <form onSubmit={this.create}>
          <input
            type="text"
            name="title"
            id="title"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="duration"
            id="duration"
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
}
export default CreateEventType;
