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
} from "reactstrap";
import { duration } from "moment";
import validate from "./InputComponents/Validation";

class EditEventType extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.location);
    //   this.props = { event: { title: "Phone Call", duration: 45 } };
    this.state = {
      id: this.props.location.event.id,
      form: {
        valid: false,
        touched: 0,
      },
      formControls: {
        title: {
          value: this.props.location.event.title,
          touched: 0,
          valid: false,
          validationRules: {
            isRequired: true,
          },
        },
        duration: {
          value: this.props.location.event.duration,
          touched: 0,
          valid: false,
          validationRules: {
            isRequired: true,
          },
        },
      },
      errMsg: "",
    };
  }
  changeHandle = (e) => {
    let { value, name } = e.target;
    let { formControls, form } = this.state;

    formControls[name].value = value;

    formControls[name].touched = 1;

    formControls[name].valid = validate(
      value,
      formControls[name].validationRules
    );

    form.valid = formControls[name].valid;
    form.touched = 1;

    this.setState({ formControls, form });
  };

  setDuration = (e, value) => {
    e.preventDefault();
    let { formControls, form } = this.state;

    formControls["duration"].value = value;

    formControls["duration"].valid = true;

    formControls["duration"].touched = 1;

    form.touched = 1;

    form.valid = true;

    this.setState({ formControls, form });
  };

  save = (e) => {
    e.preventDefault();
    console.log(this.state);

    let { title, duration } = this.state.formControls;

    axios
      .put(`api/event_type/edit/${this.state.id}`, {
        title: title.value,
        duration: duration.value,
      })
      .then((res) => {
        //      console.log(res);
        if (res.status === 200) {
          this.props.history.goBack();
        }
      })
      .catch((err) => console.log);
  };

  render() {
    // let event = this.props.location.event;
    // console.log(props.history);

    const { form } = this.state;
    const { title, duration } = this.state.formControls;

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
          Edit Event Type
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
              <Col sm={6} style={{ paddingLeft: 0 }}>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={title.value}
                  onChange={this.changeHandle}
                  style={{
                    color: "#8a2be2",
                    borderColor: "#8a2be2",
                    borderWidth: "2px",
                  }}
                />
              </Col>
            </FormGroup>

            <Label style={{ marginBottom: "2rem" }}>Event Duration*</Label>

            <div style={{ display: "flex" }} className="duration-list">
              <Button
                outline
                style={{ color: "black", width: "4rem", height: "3.5rem" }}
                className={duration.value === 15 ? "selected-duration" : ""}
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
                className={duration.value === 30 ? "selected-duration" : ""}
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
                className={duration.value === 45 ? "selected-duration" : ""}
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
                className={duration.value === 60 ? "selected-duration" : ""}
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
                  !duration_range.includes(duration.value)
                    ? "selected-duration"
                    : ""
                }
              >
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  value={
                    !duration_range.includes(duration.value)
                      ? duration.value
                      : "-"
                  }
                  onChange={this.changeHandle}
                  style={{ width: "4rem", height: "2rem" }}
                />
                <small className="text-muted" style={{ display: "block" }}>
                  custom min
                </small>
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
                disabled={form.valid === false}
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

export default EditEventType;
