import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import WaterMap from "../components/Admin/WaterMap";
import WaterPost from "../components/Admin/WaterPost";
import { LineChart, Tooltip, XAxis, CartesianGrid, Line } from "recharts";
import "./admin.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
// const WS_URL = "ws://127.0.0.1:8083";
const socket = io("http://localhost:4000");
const WaterPage = () => {
  let navigator = useNavigate();
  const [MapCenter, setMapCenter] = useState([28.7041, 77.1025]);
  const [markerData, setMarkerData] = useState([]);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [flowRate, setFlowRate] = useState(0);
  const [flowQuantity, setFlowQuantity] = useState(0);
  const [togglePost, setTogglePost] = useState(false);
  const MapProps = { MapCenter, setMapCenter };
  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

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

  const [open, setOpen] = useState(false);
  const [flowGraph, setFlow] = useState(0);

  const [graphData, setGraphData] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCordSearch = async (coords) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let url = `${NOMINATIM_BASE_URL}q=${coords[0]}%2C${coords[1]}&format=jsonv2`;
    console.log(url);
    fetch(
      `${NOMINATIM_BASE_URL}q=${coords[0]}%2C${coords[1]}&format=jsonv2`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setAddress(JSON.parse(result)[0].display_name);
      })
      .catch((err) => console.log("err: ", err));

    // setSearchText(display_name);
  };
  useEffect(() => {
    setTogglePost(true);
    socket.on("message", (message) => {
      console.log("received a new message from the server", message);
      let incomingData = JSON.parse(message);
      console.log([incomingData.Lat, incomingData.Long]);
      setMapCenter([incomingData.Lat, incomingData.Long]);

      if (
        !markerData.includes([incomingData.Lat, incomingData.Long]) &&
        incomingData.sensor_id == 2
      ) {
        setMarkerData([...markerData, [incomingData.Lat, incomingData.Long]]);
        // handleCordSearch([incomingData.Lat, incomingData.Long]);
        setAddress(
          "ITS ENGINEERING COLLEGE, 46, Knowledge Park III, Greater Noida, Uttar Pradesh 201310"
        );
        var date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        setDate(date);
      }
      setFlowQuantity(incomingData.LiquidQuantity);
      setFlowRate(incomingData.FlowRate);
      let graphInstance = {
        flow: incomingData.FlowRate,
        time: currIndex,
      };
      setCurrIndex((currIndex) => (currIndex === 9 ? 0 : currIndex + 1));

      console.log("instancre" + graphInstance);
      setGraphData((graphData) => [...graphData, graphInstance]);
    });
  }, []);
  return (
    <>
      <div className="gridContainer">
        <div className="leftPanel">
          <div className="leftPanel-bg">
            <div className="panelTop">
              <img src="./adminIcons/icon_1_2.png" alt="" className="logo" />
              <hr className="panelLine" />
            </div>
            <div className="panelMid">
              <button
                className="panelButton"
                onClick={() => navigator("/admin")}
              >
                <img className="iconTagList" src="./tagIcon.png"></img>
              </button>

              <button className="panelButton">
                <img className="iconTagList" src="./pendingIcon.png"></img>
              </button>
              <button
                className="panelButton"
                onClick={() => navigator("/fire")}
              >
                <img className="iconTagList" src="./fireButtonIcon.png"></img>
              </button>
              <button className="panelButton" onClick={() => navigator("/bin")}>
                <img className="iconTagList" src="./dustbinIcon.png"></img>
              </button>
              <button className="panelButton">
                <img className="iconTagList" src="./pipelineIcon.png"></img>
              </button>
            </div>
            <button className="panelButton">
              <img className="iconTagList" src="./settingIcon.png"></img>
            </button>
          </div>
        </div>
        <div className="rightContainer">
          <div className="upperPanel" style={{ background: "#2389da" }}>
            <div className="searchBar">
              <h1
                style={{
                  fontFamily: "DM Sans",
                  fontStyle: "normal",
                  fontWeight: "800",
                  fontSize: "45px",
                  lineHeight: "40px",
                }}
              >
                Pipeline Report
              </h1>

              <div className="userIcon">
                <a href="./profile" target="blank">
                  <i class="ri-user-fill"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="card-map">
            {togglePost && (
              <WaterPost
                address={address}
                date={date}
                flow={flowRate}
                quantity={flowQuantity}
                close={handleClose}
                open={handleOpen}
              />
            )}
            <div className="mapContainer">
              <div style={{ width: "100%", height: "100%" }}>
                <WaterMap markerData={markerData} mapProps={MapProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {console.log("graph data is : ", graphData)}
          <LineChart width={800} height={600} data={graphData}>
            <XAxis dataKey="time" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="flow" stroke="#8884d8" />
          </LineChart>
        </Box>
      </Modal>
    </>
  );
};

export default WaterPage;
