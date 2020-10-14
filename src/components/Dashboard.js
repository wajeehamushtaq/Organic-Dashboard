import React, { Component } from "react";
import "./Dashboard.css";
import WidgetText from "./WidgetText";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import WidgetBar from "./WidgetBar";
import WidgetDonet from "./WidgetDonet";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import WidgetLine from "./WidgetLine";
import WidgetCol from "./WidgetCol";

//excel import
const config = {
  apiKey: "AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI",
  spreadsheetId: "1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg"
};
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      dropdownOptions: [],
      trendStore: [],
      selectedValue: null,
      organicSourceViews: null,
      directSourceViews: null,
      referralSource: null,
      pageViews: null,
      users: null,
      newUsers: null,
      sourceArr: [],
      usersArr: []
    };
  }
  getData = (arg) => {
    const arr = this.state.items;
    const arrLen = arr.length;
    let organicSourceViews = 0;
    let directSourceViews = 0;
    let selectedValue = null;
    let referralSource = 0;
    let pageViews = 0;
    let users = 0;
    let newUsers = 0;
    let sourceArr = [];
    let usersArr = [];

    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        organicSourceViews = arr[i].organic_source;
        directSourceViews = arr[i].direct_source;
        referralSource = arr[i].referral_source;
        pageViews = arr[i].page_views;
        users = arr[i].users;
        newUsers = arr[i].new_users;
        sourceArr.push(
          {
            label: "Organic Source",
            value: arr[i].organic_source
          },
          {
            label: "Direct Source",
            value: arr[i].direct_source
          },
          {
            label: "Refferral Source",
            value: arr[i].referral_source
          }
        );
        usersArr.push(
          {
            label: "Users",
            value: arr[i].users
          },
          {
            label: "New Users",
            value: arr[i].new_users
          }
        );
      }
    }
    selectedValue = arg;

    this.setState({
      organicSourceViews: organicSourceViews,
      directSourceViews: directSourceViews,
      referralSource: referralSource,
      pageViews: pageViews,
      users: users,
      newUsers: newUsers,
      sourceArr: sourceArr,
      usersArr: usersArr
    });
  };

  updateDashboard = (event) => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };

  componentDidMount() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let batchRowValues = data.valueRanges[0].values;

        const rows = [];

        for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          rows.push(rowObject);
        }

        // dropdown options
        let dropdownOptions = [];

        for (let i = 0; i < rows.length; i++) {
          dropdownOptions.push(rows[i].month);
        }

        dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
        this.setState(
          {
            items: rows,
            dropdownOptions: dropdownOptions,
            selectedValue: "Jan 2018"
          },
          () => this.getData("Jan 2018")
        );
      });
  }

  render() {
    // Create a JSON object to store the chart configurations
    return (
      <div className="d-flex flex-wrap">
        <Container fluid>
          <Row className="TopHeader">
            <Col>
              <h4 className="dashboard"> Dashboard </h4>
            </Col>
            <Col>
              <Dropdown
                options={this.state.dropdownOptions}
                onChange={this.updateDashboard}
                value={this.state.selectedValue}
                placeholder="Select an option"
              />
            </Col>
          </Row>
        </Container>

        <Container className="mainDashboard">
          <Row>
            <Col>
              <WidgetText
                title="Organic Source"
                value={this.state.organicSourceViews}
              />
            </Col>

            <Col>
              <WidgetText
                title="Organic Source"
                value={this.state.directSourceViews}
              />
            </Col>

            <Col>
              <WidgetText
                title="Organic Source"
                value={this.state.referralSource}
              />
            </Col>

            <Col>
              <WidgetText title="Organic Source" value={this.state.pageViews} />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <WidgetText title="Users" value={this.state.users} />
            </Col>

            <Col>
              <WidgetText title="New Users" value={this.state.newUsers} />
            </Col>

            <Col>
              <WidgetBar
                title="Source Comparison"
                data={this.state.sourceArr}
              />
            </Col>

            <Col className="donut">
              <WidgetDonet title="User Comparison" data={this.state.usersArr} />
            </Col>

            <Col>
              <WidgetLine
                title="Source Comparison"
                data={this.state.sourceArr}
              />
            </Col>

            <Col>
              <WidgetCol
                title="Source Comparison"
                data={this.state.sourceArr}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
