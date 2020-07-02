import React, { Component, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Input,
  Label,
  FormGroup,
  Button,
  FormFeedback,
} from "reactstrap";
import Calendar from "react-calendar";
import axios from "axios";
//import { faClock } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import "./Calendar.css";
import "./SchedulerPanel.css";
import { Link } from "react-router-dom";
import validate from "./InputComponents/Validation";

const current_date = new Date();

class SchedularPanel extends Component {
  constructor(props) {
    super(props);
    /*   this.duration = Number(
      this.props.location.event.duration.replace(" min", "")
    );
    */

    this.event = this.props.location.event;
    this.user = this.props.location.user;

    //For testing: mock data
    //    this.event = { id: 1, title: "Demo Call", duration: 10 };
    //    this.user = { name: "Shrikant Gawas" };

    this.bookSlots = this.event.duration / 15;
    console.log(this.bookSlots);

    this.timeSlot = [];

    const periodsInADay = moment.duration(1, "day").as("m");

    console.log("periodsInADay:", periodsInADay);

    const startTimeMoment = moment("10:00", "HH:mm");

    const stopTimeMoment = moment("19:00", "HH:mm");

    console.log("startTimeMoment", startTimeMoment);
    console.log("stopTimeMoment", stopTimeMoment);

    for (let i = 0; i <= periodsInADay; i += this.event.duration) {
      startTimeMoment.add(i === 0 ? 0 : this.event.duration, "m");
      if (startTimeMoment < stopTimeMoment) {
        this.timeSlot.push(startTimeMoment.format("HH:mm"));
      } else {
        break;
      }
    }

    //     this.lastIndex = this.timeSlot.length - 1;
    //    console.log(this.lastIndex);
    //  this.timeSlot.splice(-this.bookSlots);

    this.state = {
      selectDate: new Date(),
      selectedSlotStart: null,
      selectedSlotEnd: null,
      timeSlot: this.timeSlot,

      availableTimeSlots: [],
      disableDates: [],
      form: {
        valid: false,
        touched: 0,
        successMsg: "Event has been scheduled successfully",
        errMsg:
          "It seems there was some issue while submitting your request, kindly try once again!!!",
      },
      formControls: {
        firstName: {
          value: "",
          placeholder: "Please enter your first-name",
          valid: false,
          touched: 0,
          validationRules: {
            isRequired: true,
          },
          errMsg: "Your first-name is required",
          successMsg: "Entered first-name is valid",
        },
        lastName: {
          value: "",
          placeholder: "Please enter your last-name",
          valid: false,
          touched: 0,
          validationRules: {
            isRequired: true,
          },
          errMsg: "Your last-name is required",
          successMsg: "Entered last-name is valid",
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
      },
      scheduleAgain: false,
    };
  }

  fetchAvailableSlots = (date) => {
    axios
      .get(
        `api/schedule_events/${this.event.id}/${
          this.event.duration
        }?date=${date.toISOString()}`
      )
      .then((res) => {
        console.log(res.status);
        if (res.status === 200 && res.data.availableTimeSlots.length > 0) {
          this.setState({
            availableTimeSlots: res.data.availableTimeSlots,
          });
          console.log(this.state.availableTimeSlots);
        }

        if (res.status === 200 && res.data.disableDate === true) {
          this.setState((state) => {
            return {
              ...state,
              disableDates: [...state.disableDates, date.toLocaleDateString()],
            };
          });
        }
      })
      .catch((err) => console.log);
  };

  componentDidMount() {
    this.fetchAvailableSlots(this.state.selectDate);
  }

  disableDates = ({ date }) => {
    console.log(date.toLocaleDateString(), current_date.toLocaleDateString());
    return (
      date.getDay() === 6 ||
      date.getDay() === 0 ||
      !(
        date > current_date ||
        date.toLocaleDateString() === current_date.toLocaleDateString()
      ) ||
      this.state.disableDates.includes(date.toLocaleDateString())
      //       this.state.timeSlot.length === 0
    );
  };

  onChangeDate = (date) => {
    //    console.log(date.toLocaleDateString());
    this.fetchAvailableSlots(date);
  };

  onClickHandler = (e, slot) => {
    let selectedSlotStart = slot;
    let selectedSlotEnd = moment(slot, "HH:mm")
      .add(this.event.duration, "m")
      .format("HH:mm");

    console.log(
      "Selected Date & Selected Slot",
      this.state.selectDate,
      selectedSlotStart,
      selectedSlotEnd
    );
    this.setState({
      selectedSlotStart,
      selectedSlotEnd,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    let { form, formControls } = this.state;

    const updatedControls = {
      ...formControls,
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

  scheduleAgain = (event) => {
    event.preventDefault();
    let {
      form,
      selectDate,
      selectedSlotStart,
      selectedSlotEnd,
      formControls,
      scheduleAgain,
    } = this.state;

    scheduleAgain = true;

    formControls.firstName.valid = false;
    formControls.firstName.touched = 0;

    formControls.lastName.valid = false;
    formControls.lastName.touched = 0;
    formControls.email.valid = false;
    formControls.email.touched = 0;
    form.valid = true;
    form.touched = 1;
    selectedSlotStart = null;
    selectedSlotEnd = null;
    selectDate = new Date();

    this.setState(
      {
        form,
        selectDate,
        selectedSlotStart,
        selectedSlotEnd,
        formControls,
        scheduleAgain,
      },
      () => this.fetchAvailableSlots(this.state.selectDate)
    );
  };

  scheduleEvent = (event) => {
    event.preventDefault();
    let { selectDate } = this.state;

    let { formControls, form } = this.state;
    let firstName = formControls.firstName;
    let lastName = formControls.lastName;
    let email = formControls.email;

    let data = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      selectDate: selectDate.toISOString(),
      selectedSlotStart: this.state.selectedSlotStart,
      selectedSlotEnd: this.state.selectedSlotEnd,
    };

    console.log("scheduled event data:", data);

    axios
      .post(`/api/schedule_event/${this.event.id}`, data)
      .then((res) => {
        console.log(res);
        /*      firstName = { ...firstName, value: "", touched: 0, valid: false };
        lastName = { ...lastName, value: "", touched: 0, valid: false };
        email = { ...email, value: "", touched: 0, valid: false };

          formControls = {
          ...formControls,
          firstName,
          lastName,
          email,
        };
*/
        form = { ...form, touched: 0 };

        this.setState({
          //        formControls,
          form,
        });
      })
      .catch((err) => {
        console.log(err);

        firstName = { ...firstName, value: "", touched: 0, valid: false };
        lastName = { ...lastName, value: "", touched: 0, valid: false };
        email = { ...email, value: "", touched: 0, valid: false };

        form = { ...form, valid: false, touched: 1 };

        form.errMsg = err.response.data;

        formControls = {
          ...formControls,
          firstName,
          lastName,
          email,
        };

        this.setState({
          formControls,
          form,
        });
      });
  };

  render() {
    /*  console.log(this.props);

    let backLink = this.props.location.pathname.replace("/panel", "");

    let event = this.props.location.event;

    let user = this.props.location.user;

    */

    /* <p> {props.location.duration} </p>
  <p> {props.location.user.name} </p>
*/

    const {
      availableTimeSlots,
      timeSlot,
      selectDate,
      form,
      scheduleAgain,
    } = this.state;
    const { firstName, lastName, email } = this.state.formControls;

    console.log("now date:", selectDate.toLocaleDateString());

    let timeSlotDisplay = [];

    if (availableTimeSlots.length > 0) {
      timeSlotDisplay = availableTimeSlots;
    } else {
      timeSlotDisplay = timeSlot;
    }

    //  if (data.length > 0) {

    // }

    return (
      <div className="scheduler-panel-wrapper">
        {form.valid && form.touched === 0 ? (
          <div className="confirmed">
            <p style={{ textAlign: "center", marginBottom: "1rem" }}>
              <strong>Confirmed</strong>
              <br />
              You are scheduled with {firstName.value} {lastName.value}.
            </p>
            <hr />
            <div>
              <span>
                <i
                  className="fas fa-circle"
                  style={{ color: "#7B68EE", marginRight: "10px" }}
                />
                {this.event.title}
              </span>
              <br />
              <p style={{ color: "#2E8B57", marginTop: "2rem" }}>
                <i
                  className="far fa-calendar"
                  style={{ marginRight: "10px" }}
                />
                {`${moment(this.state.selectedSlotStart, "hh:mm A").format(
                  "hh:mm A"
                )} - ${moment(this.state.selectedSlotEnd, "hh:mm A").format(
                  "hh:mm A"
                )},
                    ${this.state.selectDate.toDateString()}`}
              </p>
            </div>
            <hr />
            <Button
              outline
              color="primary"
              className="schedule-again-btn"
              onClick={this.scheduleAgain}
            >
              <i
                className="fas fa-arrow-right"
                style={{ marginRight: "10px" }}
              />
              Click to schedule another event with {firstName.value}{" "}
              {lastName.value}
            </Button>
          </div>
        ) : (
          <Row>
            <Col className="column-first" xs={4}>
              <div style={{ marginTop: "50px", textAlign: "left" }}>
                <p>
                  <i
                    className="fas fa-arrow-circle-left"
                    style={{ color: "blue", fontSize: "2rem" }}
                    onClick={() => this.props.history.goBack()}
                  />
                </p>
                <small style={{ color: "grey" }}>{this.user.name}</small>
                <h4>{this.event.title}</h4>
                <i className="fas fa-clock" style={{ color: "grey" }} />{" "}
                <small style={{ color: "grey" }}>
                  {this.event.duration} mins
                </small>
                {this.state.selectDate &&
                this.state.selectedSlotStart &&
                this.state.selectedSlotEnd ? (
                  <p style={{ color: "#2E8B57", marginTop: "2rem" }}>
                    <i className="far fa-calendar"></i>{" "}
                    {`${moment(this.state.selectedSlotStart, "hh:mm A").format(
                      "hh:mm A"
                    )} - ${moment(this.state.selectedSlotEnd, "hh:mm A").format(
                      "hh:mm A"
                    )},
                    ${this.state.selectDate.toDateString()}`}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </Col>

            <Col className="column-second">
              {this.state.selectDate &&
              this.state.selectedSlotStart &&
              this.state.selectedSlotEnd ? (
                <div style={{ marginTop: "2rem" }}>
                  <h4>Enter Details</h4>
                  <Form className="form">
                    <Row form>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="firstName">First Name*</Label>
                          <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="input"
                            value={firstName.value}
                            placeholder={firstName.placeholder}
                            touched={firstName.touched}
                            valid={firstName.valid}
                            disabled={scheduleAgain}
                            onChange={this.handleChange}
                          />
                          <FormFeedback valid>
                            {firstName.successMsg}
                          </FormFeedback>
                          <FormFeedback
                            className={
                              firstName.touched === 1 &&
                              firstName.valid === false
                                ? "d-block"
                                : ""
                            }
                          >
                            {firstName.errMsg}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="lastName">Last Name*</Label>
                          <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="input"
                            value={lastName.value}
                            placeholder={lastName.placeholder}
                            touched={lastName.touched}
                            valid={lastName.valid}
                            onChange={this.handleChange}
                            disabled={scheduleAgain}
                          />
                          <FormFeedback valid>
                            {lastName.successMsg}
                          </FormFeedback>
                          <FormFeedback
                            className={
                              lastName.touched === 1 && lastName.valid === false
                                ? "d-block"
                                : ""
                            }
                          >
                            {lastName.errMsg}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label for="email">Email*</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
                        value={email.value}
                        placeholder={email.placeholder}
                        touched={email.touched}
                        valid={email.valid}
                        disabled={scheduleAgain}
                        onChange={this.handleChange}
                      />
                      <FormFeedback valid>{email.successMsg}</FormFeedback>
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
                        color="primary"
                        className="button"
                        disabled={form.valid === false}
                        onClick={this.scheduleEvent}
                      >
                        Schedule Event
                      </Button>
                    </FormGroup>
                    <FormFeedback
                      className={
                        form.valid === false && form.touched === 1
                          ? "d-block"
                          : ""
                      }
                    >
                      {form.errMsg}
                    </FormFeedback>
                  </Form>
                </div>
              ) : (
                <>
                  <Col>
                    <div>
                      <p style={{ textAlign: "right" }}>
                        {this.state.selectDate.toDateString()}
                      </p>
                      <p style={{ textAlign: "left" }}>Select a Date & Time</p>
                      <Calendar
                        onChange={this.onChangeDate}
                        value={this.state.selectDate}
                        tileDisabled={this.disableDates}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <ul className="list">
                        {timeSlotDisplay &&
                          timeSlotDisplay.length > 0 &&
                          timeSlotDisplay.map((slot, index) => (
                            <li
                              key={index}
                              onClick={(event) =>
                                this.onClickHandler(event, slot)
                              }
                            >
                              {moment(slot, "hh:mm A").format("hh:mm A")}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </Col>
                </>
              )}
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default SchedularPanel;
