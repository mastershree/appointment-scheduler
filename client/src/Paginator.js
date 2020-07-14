import React, { PureComponent } from "react";
import { Card, CardTitle, Table, Button, ButtonGroup } from "reactstrap";

class Paginator extends PureComponent {
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
    currPage = currPage + 1;

    displayData = data.slice(offset, currPage * perPage);
    this.setState({ offset, currPage, displayData }, () =>
      console.log(this.state.currPage)
    );
  };

  previous = (e) => {
    e.preventDefault();
    let { currPage, offset, data, displayData, perPage } = this.state;

    if (offset === 0) return;
    offset = offset - 2;
    currPage = currPage - 1;
    displayData = data.slice(offset, currPage * perPage);
    this.setState({ offset, currPage, displayData }, () =>
      console.log(this.state.currPage)
    );
  };

  render() {
    const { displayData, pageCount, currPage } = this.state;

    let buttons = [];

    for (let i = 1; i <= pageCount; i++) {
      buttons.push(
        <Button
          key={i}
          className={currPage === i ? "active" : ""}
          onClick={(e) => this.handleClick(e, i)}
        >
          {i}
        </Button>
      );
    }

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
                  <CardTitle>{evt.date_mod}</CardTitle>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          {evt.time_slot_start_mod} -{evt.time_slot_end_mod}
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
            {buttons.length > 0 && buttons.map((a) => a)}
            <Button onClick={this.previous}>Previous</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default Paginator;
