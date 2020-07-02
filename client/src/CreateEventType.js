import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Card,
  CardFooter,
  FormFeedback,
} from "reactstrap";

class CreateEventType extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.location);
    //   this.props = { event: { title: "Phone Call", duration: 45 } };
    this.state = {
      title: {
        placeholder: "Please enter the event name",
        value: "",
        touched: 0,
      },
      duration: 0,
      user: this.props.location.user,
      errMsg: "",
    };
  }

  changeHandle = (e) => {
    let { value } = e.target;
    let { title, errMsg } = this.state;
    title.value = value;
    title.touched = 1;
    errMsg = "";

    this.setState({ title, errMsg });
  };

  setDuration = (e, value) => {
    e.preventDefault();
    this.setState({ duration: value });
  };

  save = (e) => {
    e.preventDefault();
    console.log(this.state);

    let { title } = this.state;

    axios
      .post("api/event_type/create/", {
        title: title.value,
        duration: this.state.duration,
        user: this.state.user,
      })
      .then((res) => {
        //      console.log(res);
        if (res.status === 200) {
          console.log(res);
          this.props.history.goBack();
        }
      })
      .catch((err) => {
        console.log(err.response);
        title.value = "";

        this.setState({ title, errMsg: err.response.data });
      });
  };

  render() {
    // let event = this.props.location.event;
    // console.log(props.history);

    const { title } = this.state;

    let duration_range = [15, 30, 45, 60];

    return (
      <div style={{ margin: "50px 50px 50px 150px" }}>
        <Button
          outline
          color="primary"
          onClick={() => this.props.history.goBack()}
        >
          {"< Back"}
        </Button>
        <h4 style={{ paddingLeft: "20rem", display: "inline-block" }}>
          Add Event Type
        </h4>
        <br />
        <br />

        <hr />
        <Card
          body
          style={{ marginTop: "3rem", border: "0.1rem #483D8B solid" }}
        >
          <Form>
            <FormGroup style={{ marginBottom: "2rem" }}>
              <Label for="Title" style={{ marginBottom: "1rem" }}>
                Event Name*
              </Label>
              <Col sm={10} style={{ paddingLeft: 0 }}>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder={title.placeholder}
                  value={title.value}
                  onChange={this.changeHandle}
                  required
                  style={{
                    color: "#8a2be2",
                    borderColor: "#8a2be2",
                    borderWidth: "2px",
                  }}
                />
                <FormFeedback
                  className={this.state.errMsg.length > 0 ? "d-block" : ""}
                >
                  {this.state.errMsg}
                </FormFeedback>
              </Col>
            </FormGroup>

            <Label style={{ marginBottom: "2rem" }}>Event Duration*</Label>

            <div style={{ display: "flex" }} className="duration-list">
              <Button
                outline
                style={{ color: "black", width: "4rem", height: "3.5rem" }}
                className={
                  this.state.duration === 15 ? "selected-duration" : ""
                }
                onClick={(event) => this.setDuration(event, 15)}
              >
                15
                <small className="text-muted" style={{ display: "block" }}>
                  min
                </small>
              </Button>
              <Button
                outline
                style={{ color: "black", width: "4rem", height: "3.5rem" }}
                className={
                  this.state.duration === 30 ? "selected-duration" : ""
                }
                onClick={(event) => this.setDuration(event, 30)}
              >
                30
                <small className="text-muted" style={{ display: "block" }}>
                  min
                </small>
              </Button>
              <Button
                outline
                style={{ color: "black", width: "4rem", height: "3.5rem" }}
                className={
                  this.state.duration === 45 ? "selected-duration" : ""
                }
                onClick={(event) => this.setDuration(event, 45)}
              >
                45
                <small className="text-muted" style={{ display: "block" }}>
                  min
                </small>
              </Button>
              <Button
                outline
                style={{ color: "black", width: "4rem", height: "3.5rem" }}
                className={
                  this.state.duration === 60 ? "selected-duration" : ""
                }
                onClick={(event) => this.setDuration(event, 60)}
              >
                60
                <small className="text-muted" style={{ display: "block" }}>
                  min
                </small>
              </Button>
              <Card
                style={{
                  display: "inline-block",
                  color: "black",
                  width: "6rem",
                  height: "3.5rem",
                  alignSelf: "baseline",
                  marginLeft: "1rem",
                  textAlign: "center",
                  borderColor: "black",
                }}
                className={
                  !duration_range.includes(this.state.duration)
                    ? "selected-duration"
                    : ""
                }
              >
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  onChange={this.changeHandle}
                  style={{ height: "2rem", width: "4rem" }}
                />
                <small style={{ display: "block" }}>custom min</small>
              </Card>
            </div>
            <br />

            <hr />
            <FormGroup
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                outline
                style={{ marginRight: "20px" }}
                onClick={() => this.props.history.goBack()}
              >
                Cancel
              </Button>

              <Button
                color="primary"
                onClick={this.save}
                disabled={this.state.duration === 0 || title.value === ""}
              >
                Save
              </Button>
            </FormGroup>
          </Form>
        </Card>
      </div>
    );
  }
}

export default CreateEventType;
