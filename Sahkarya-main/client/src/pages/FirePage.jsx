import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import FireMap from "../components/Admin/FireMap";
import FirePost from "../components/Admin/FirePost";
import "./admin.css";
// const WS_URL = "ws://127.0.0.1:8083";
const socket = io("http://localhost:4000");
const FirePage = () => {
  let navigator = useNavigate();
  const [MapCenter, setMapCenter] = useState([28.7041, 77.1025]);
  const [markerData, setMarkerData] = useState([]);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [togglePost, setTogglePost] = useState(false);
  const MapProps = { MapCenter, setMapCenter };
  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

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
    socket.on("message", (message) => {
      console.log("received a new message from the server", message);
      let incomingData = JSON.parse(message);
      console.log(incomingData);

      if (
        !markerData.includes([incomingData.Lat, incomingData.Long]) &&
        incomingData.sensor_id == 1
      ) {
        setMapCenter([incomingData.Lat, incomingData.Long]);
        setTogglePost(true);
        setMarkerData([...markerData, [incomingData.Lat, incomingData.Long]]);
        // handleCordSearch([incomingData.Lat,incomingData.Long])
        setAddress(
          "ITS ENGINEERING COLLEGE, 46, Knowledge Park III, Greater Noida, Uttar Pradesh 201310"
        );
        var date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        setDate(date);
      }
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
              <button
                className="panelButton"
                onClick={() => navigator("/pipe")}
              >
                <img className="iconTagList" src="./pipelineIcon.png"></img>
              </button>
            </div>
            <button className="panelButton">
              <img className="iconTagList" src="./settingIcon.png"></img>
            </button>
          </div>
        </div>
        <div className="rightContainer">
          <div className="upperPanel" style={{ background: "#ff9a00" }}>
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
                Fire Report
              </h1>

              <div className="userIcon">
                <a href="./profile" target="blank">
                  <i class="ri-user-fill"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="card-map">
            {togglePost && <FirePost address={address} date={date} />}
            <div className="mapContainer">
              <div style={{ width: "100%", height: "100%" }}>
                <FireMap markerData={markerData} mapProps={MapProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FirePage;
