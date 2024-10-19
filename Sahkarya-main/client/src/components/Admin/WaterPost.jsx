import React from "react";
import SocketIOClient from "socket.io-client";
import { LineChart, Tooltip, XAxis, CartesianGrid, Line } from "recharts";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  height: "fit-content",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

const WaterPost = (prop) => {
  let address = prop.address;
  let date = prop.date;
  let quantity = prop.quantity;
  let flow = prop.flow;
  let handleOpen = prop.open;
  let handleClose = prop.close;
  console.log("flow is : ", flow);

  const [currIndex, setCurrIndex] = useState(0);

  return (
    <>
      <div className="card2" style={cardStyle}>
        <div className="cardText2" style={addressStyle}>
          Address: {address}
        </div>
        <div className="cardTag2" style={tagStyle}>
          Water Flow Rate: {flow} L/min
        </div>
        <div className="cardTag2" style={tagStyle}>
          Total Quantity of Water Flow: {quantity} ml
        </div>
        <div style={dateStyle}>{date}</div>
        <img
          src="./fireIcon.png"
          alt=""
          className="tagIcon"
          style={iconStyle}
        />
        <Button onClick={handleOpen}>view Graph</Button>
      </div>
    </>
  );
};

const cardStyle = {
  backgroundColor: "#74ccf4",
  borderRadius: "8px",
  padding: "20px",
  margin: "10px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

const tagStyle = {
  backgroundColor: "#ff5a00",
  color: "#fff",
  padding: "10px",
  borderRadius: "4px",
  marginBottom: "10px",
};

const textStyle = {
  margin: "10px 0",
};

const addressStyle = {
  padding: "10px",
  marginBottom: "10px",
};

const dateStyle = {
  color: "#666",
  fontSize: "14px",
};

const iconStyle = {
  width: "20px",
  height: "20px",
};

export default WaterPost;
