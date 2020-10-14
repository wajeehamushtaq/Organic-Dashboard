import React, { Component } from "react";
import "./Dashboard.css";
import { Col, Row, Container } from "react-bootstrap";

function WidgetText(props) {
  return (
    <div className="widgetWrap">
      <div className="widgetTitle">{props.title}</div>
      <div className="widgetValue">
        <div class="value">{props.value}</div>
        <div class="description">{props.description}</div>
      </div>
    </div>
  );
}

export default WidgetText;
