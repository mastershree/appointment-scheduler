import React, { Component } from "react";
import axios from "axios";

class EditEventType extends Component {
  editEventType = this.props.location.eventType;

  state = {
    title: this.editEventType.title,
    duration: this.editEventType.duration,
  };

  //editEventType = this.props.eventType;

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  edit = (event) => {
    event.preventDefault();
    let { title, duration } = this.state;
    let user = this.props.location.user;
    console.log("Editing");
    axios
      .put(`api/event_type/edit/${this.editEventType.title}`, {
        title,
        duration,
        user,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("Event type edited successfully", res);
        }
      })
      .catch((err) => console.log);
  };

  render() {
    //  console.log(editEventType);
    return (
      <>
        <form onSubmit={this.edit}>
          <input
            type="text"
            name="title"
            value={this.state.title}
            id="title"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="duration"
            id="duration"
            value={this.state.duration}
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
}
export default EditEventType;
