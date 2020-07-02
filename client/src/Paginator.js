import React, { Component } from "react";
import { Card, CardTitle, Table, Button, ButtonGroup } from "reactstrap";

class Paginator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      perPage: this.props.perPage,
      data: this.props.data,
      pageCount: Math.ceil(this.props.data.length / this.props.perPage),
      offset: 0,
      currPage: 1,
      displayData: this.props.data.slice(0, this.props.perPage),
    };

    this.buttons = [];

    for (let i = 1; i <= this.state.pageCount; i++) {
      this.buttons.push(
        <Button key={i} onClick={(e) => this.handleClick(e, i)}>
          {i}
        </Button>
      );
    }
    console.log(this.buttons);
  }

  /*
  componentDidMount() {
    this.setState((state) => ({
      ...state,
      displayData: this.state.data.slice(
        this.state.offset,
        this.state.currPage * this.state.perPage
      ),
    }));
  }
*/

  handleClick = (e, value) => {
    e.preventDefault();

    let offsetEnd = this.state.perPage * value;
    let offsetStart = offsetEnd - this.state.perPage;
    let data = this.state.data.slice(offsetStart, offsetEnd);
    console.log(offsetStart);
    this.setState({ displayData: data, currPage: value, offset: offsetStart });
  };

  next = (e) => {
    e.preventDefault();
    let {
      currPage,
      offset,
      data,
      displayData,
      perPage,
      pageCount,
    } = this.state;
    console.log("Page Count", pageCount);

    if (currPage === pageCount) {
      console.log("You have reached at the end of the list");
      return;
    }

    offset = offset + 2;
    currPage++;

    displayData = data.slice(offset, currPage * perPage);
    this.setState({ offset, currPage, displayData });
  };

  previous = (e) => {
    e.preventDefault();
    let {
      currPage,
      offset,
      data,
      displayData,
      perPage,
      pageCount,
    } = this.state;

    if (offset === 0) return;
    offset = offset - 2;
    currPage--;
    displayData = data.slice(offset, currPage * perPage);
    this.setState({ offset, currPage, displayData });
  };

  render() {
    let { displayData } = this.state;

    if (displayData.length > 0) {
      console.log("Paginator:", displayData);
    }
    return (
      <div className="paginator-container">
        <div className="paginator-content">
          {this.state.displayData.length > 0
            ? this.state.displayData.map((evt, index) => (
                <Card
                  key={index}
                  style={{
                    padding: "0.5rem",
                  }}
                >
                  <CardTitle>{evt.date}</CardTitle>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          {evt.time_slot_start} -{evt.time_slot_end}
                        </td>
                        <td>
                          {evt.first_name} {evt.last_name}
                          <br />
                          Event Type: {evt.title}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
              ))
            : ""}
        </div>
        <div className="paginator">
          <ButtonGroup>
            <Button onClick={this.next}>Next</Button>
            {this.buttons.length > 0 && this.buttons.map((a) => a)}
            <Button onClick={this.previous}>Previous</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default Paginator;
