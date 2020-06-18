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
} from "reactstrap";
import Calendar from "react-calendar";
import axios from "axios";
//import { faClock } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "./SchedulerPanel.css";
import { Link } from "react-router-dom";

class SchedularPanel extends Component {
  constructor(props) {
    super(props);
    /*   this.duration = Number(
      this.props.location.event.duration.replace(" min", "")
    );
    */

    this.event = this.props.location.event;
    this.user = this.props.location.user;

    this.bookSlots = this.event.duration / 15;
    console.log(this.bookSlots);

    this.timeSlot = [];

    const periodsInADay = moment.duration(1, "day").as("m");

    console.log("periodsInADay:", periodsInADay);

    const startTimeMoment = moment("10:00", "hh:mm");

    const stopTimeMoment = moment("19:00", "hh:mm");

    console.log("startTimeMoment", startTimeMoment);
    console.log("stopTimeMoment", stopTimeMoment);

    for (let i = 0; i <= periodsInADay; i += this.event.duration) {
      startTimeMoment.add(i === 0 ? 0 : this.event.duration, "m");
      if (startTimeMoment < stopTimeMoment) {
        this.timeSlot.push(startTimeMoment.format("hh:mm A"));
      } else {
        break;
      }
    }

    //     this.lastIndex = this.timeSlot.length - 1;
    //    console.log(this.lastIndex);
    //  this.timeSlot.splice(-this.bookSlots);

    this.state = {
      selectDate: new Date(),

      timeSlot: this.timeSlot,
      data: [],
    };
  }

  componentDidMount() {
    axios
      .get(`api/schedule_events/${this.event.id}/${this.event.duration}`)
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          this.setState((state) => {
            console.log(Array.isArray(res.data.dates));
            return { ...state, data: res.data.dates };
          });
          console.log(this.state.data);
        }
      })
      .catch((err) => console.log);
  }

  disableDates = ({ date }) => {
    // console.log(date.toLocaleDateString());
    return (
      date.getDay() === 6 || date.getDay() === 0 || date < new Date()
      // || this.state.datesToDisable.includes(date.toLocaleDateString())
      //       this.state.timeSlot.length === 0
    );
  };

  onChangeDate = (e) => {
    console.log(e.toLocaleDateString());
    this.setState({
      selectDate: e,
    });

    //   return;
  };

  onClickHandler = (e, index) => {
    let oldTimeSlot = [...this.state.timeSlot];

    let duration = this.event.duration;
    console.log(duration);

    let selectedSlotStart = oldTimeSlot[index];
    let selectedSlotEnd = oldTimeSlot[index + 1];

    oldTimeSlot.splice(index, 1);

    console.log(
      "Selected Date & Selected Slot",
      this.state.selectDate,
      selectedSlotStart,
      selectedSlotEnd
    );
    this.setState({
      timeSlot: oldTimeSlot,
      selectedSlotStart,
      selectedSlotEnd,
    });
  };

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  scheduleEvent = (event) => {
    event.preventDefault();
    let { selectDate } = this.state;

    let curDate = selectDate.getDate();
    let curMonth = selectDate.getMonth() + 1;
    let curYear = selectDate.getFullYear();

    let nowDate = `${curYear}-${curMonth}-${curDate}`;

    console.log("Schedule date", nowDate);

    let data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      emailAddress: this.state.emailAddress,
      selectDate: nowDate,
      selectedSlotStart: this.state.selectedSlotStart,
      selectedSlotEnd: this.state.selectedSlotEnd,
    };

    console.log("scheduled event data:", data);

    axios
      .post(`api/schedule_event/${this.event.id}`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log);
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

    const { data, selectDate } = this.state;

    console.log("now date:", selectDate.toLocaleDateString());

    //  if (data.length > 0) {
    let cur = data.filter((a) => {
      console.log("date in db", a.date);
      return a.date === selectDate.toLocaleDateString();
    });
    let [for_cur_date] = cur;
    console.log(for_cur_date);
    console.log(selectDate);
    // }

    return (
      <Container className="Container">
        <Row>
          <Col
            style={{
              //   background: "lightgrey",
              borderRight: "1px solid #E6E6FA",
              width: "50%",
              height: "96vh",
              display: "flex",
              justifyContent: "left",
            }}
            xs={4}
          >
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
              <small style={{ color: "grey" }}>{this.event.duration}</small>
              {this.state.selectDate &&
              this.state.selectedSlotStart &&
              this.state.selectedSlotEnd ? (
                <p style={{ color: "#2E8B57", marginTop: "2rem" }}>
                  <i className="far fa-calendar"></i>{" "}
                  {`${this.state.selectedSlotStart} - ${
                    this.state.selectedSlotEnd
                  },
                    ${this.state.selectDate.toDateString()}`}
                </p>
              ) : (
                ""
              )}
            </div>
          </Col>

          <Col
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            {this.state.selectDate &&
            this.state.selectedSlotStart &&
            this.state.selectedSlotEnd ? (
              <div style={{ marginTop: "2rem" }}>
                <h4>Enter Details</h4>
                <Form style={{ marginTop: "2rem" }}>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="firstName">First Name*</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="lastName">Last Name*</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="emailAddress">Email*</Label>
                    <Input
                      type="email"
                      id="emailAddress"
                      name="emailAddress"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button color="primary" onClick={this.scheduleEvent}>
                      Schedule Event
                    </Button>
                  </FormGroup>
                </Form>
              </div>
            ) : (
              <>
                <Col>
                  <div>
                    <p style={{ textAlign: "right" }}>
                      {" "}
                      {this.state.selectDate.toDateString()}{" "}
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
                    {for_cur_date && for_cur_date.availableTimeSlots ? (
                      <ul style={{ height: "90vh", overflow: "scroll" }}>
                        {for_cur_date.availableTimeSlots.map((slot, index) => (
                          <li
                            style={{
                              margin: "0.5rem",
                              padding: "1rem",
                              width: "90%",
                              height: "10%",
                              border: "1px solid skyblue",
                              borderRadius: "4px",
                            }}
                            key={index}
                            onClick={(event) =>
                              this.onClickHandler(event, index)
                            }
                          >
                            {slot}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul style={{ height: "90vh", overflow: "scroll" }}>
                        {this.state.timeSlot.map((slot, index) => (
                          <li
                            style={{
                              margin: "0.5rem",
                              padding: "1rem",
                              width: "90%",
                              height: "10%",
                              border: "1px solid skyblue",
                              borderRadius: "4px",
                            }}
                            key={index}
                            onClick={(event) =>
                              this.onClickHandler(event, index)
                            }
                          >
                            {slot}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Col>
              </>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SchedularPanel;
