import React, { useRef, useState, useEffect } from "react";
import "./concern.css";
import { useAuth } from "../store/auth";
import MapContainer from "../components/MapContainer";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { departments, tags } from "../assets/variables";
var currLoc;

const Concern = () => {
  const [tagList, setTagList] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    address: "",
    department: "",

    tags: "",
    image: null,
  });

  const { isLoggedIn } = useAuth();

  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage(error.message);
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const [userData, setUserData] = useState(true);
  const { user } = useAuth();

  if (user && userData && coords.latitude != null) {
    console.log(coords);
    setFormData({
      email: user.email,
      address: coords.latitude + " " + coords.longitude,
      department: "",
      image: "",
    });
    setUserData(false);
  }

  const [mapToggle, setMapToggle] = useState(false);
  const [charCount, setCharCount] = useState(500);

  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
        console.log(image);
      }
    }
  };

  const handleChange = (e) => {
    const newMessage = e.target.value;
    setFormData({ ...formData, message: newMessage });
    setCharCount(500 - newMessage.length);
  };

  // Consider using a state variable or useRef for focused state management
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    // Backend logic
    try {
      const response = await fetch("http://localhost:80/api/form/concern", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Concern sent successfully");
        alert("Seccessfull ");
        setFormData({
          email: user.email,
          message: "",
          address: "",
          department: "",
          image: "",
        });
        setCharCount(500);
      }
    } catch (error) {
      console.log("Error while sending the message", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "3.2rem" }}>
              You need to login to share your concern!
            </p>
            <a href="/login">
              <button
                type="submit"
                style={{
                  fontWeight: "500",
                  height: "40px",
                  width: "245px",
                  marginTop: "30px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#ffc107",
                  paddingTop: "5px",
                }}
              >
                Login Here
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
        rel="stylesheet"
      />

      <div
        className="body-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#fff",
          backgroundImage: "url('image6.jpeg')",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        {" "}
        {/* Added a class for styling */}
        <div
          className="wrapper"
          style={{
            background: "rgba(221, 221, 222, 0.95)", // Adjust the alpha value (0.9 in this case) for transparency
            maxHeight: "1100px", // Corrected capitalization of maxHeight
            maxWidth: "700px",
            width: "100%",
            borderRadius: "15px",
            padding: "25px 25px 15px 25px",
            boxShadow: "0px 10px 15px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="privacy"
            style={{
              color: "#ffc107",
              margin: "8px 0",
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 10px",
              borderRadius: "50px",
              transition: "background 0.2s ease",
            }}
          >
            <i className="ri-chat-new-fill" style={{ fontSize: "25px" }}></i>
            <span
              className="problem"
              style={{ fontSize: "25px", fontWeight: "600", marginLeft: "7px" }}
            >
              Share you Concern
            </span>
          </div>
          <div
            className="input-box"
            style={{
              position: "relative",
              minHeight: "220px",
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            <div
              className="tweet-area"
              style={{
                position: "absolute",
                marginTop: "-3px",
                fontSize: "22px",
                color: "#98a5b1",
              }}
            >
              <textarea
                type="text" // Changed to a standard input type
                className={`input editable ${isFocused ? "focused" : ""}`}
                value={formData.message}
                onChange={handleChange}
                placeholder="What's on your mind"
                maxLength={500} // Added maxLength for character limit
                style={{
                  height: "200px",
                  width: "650px",
                  marginTop: "5px",
                  background: "#fff",
                  borderRadius: "10px",
                  paddingLeft: "6px",
                  outline: "none",
                  fontSize: "17px",
                  minHeight: "inherit",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  position: "relative",
                  zIndex: "5",
                }}
              />
            </div>
          </div>

          <div>
            <div
              className="department-label"
              style={{
                color: "#ffc107",
                marginTop: "0px",
                marginBottom: "5px",
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 10px",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <i className="ri-community-fill"></i>
              <span
                className="department-label-content"
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginLeft: "7px",
                }}
              >
                Choose the department
              </span>
            </div>
            <Autocomplete
              disablePortal
              limitTags={1}
              id="departments"
              options={departments}
              onChange={(e, value) => {
                setFormData({ ...formData, department: value.id });
                var filteredTag = tags.filter(function (item) {
                  return item.department_id === value.id;
                });
                setTagList(filteredTag);
              }}
              sx={{ width: 400 }}
              renderTags={(options) => {
                return options.map((option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  >
                    <img
                      src={option.logo}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "10px",
                      }}
                    />
                    {option.description}
                  </Box>
                ));
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    src={`./departments/${option.id}.png`}
                    style={{
                      height: "20px",
                      width: "20px",
                      marginRight: "10px",
                    }}
                  />
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select department"
                />
              )}
            />
          </div>
          <div>
            <div
              className="tag-label"
              style={{
                color: "#ffc107",
                marginTop: "0px",
                marginBottom: "5px",
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 10px",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <i className="ri-community-fill"></i>
              <span
                className="tag-label-content"
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginLeft: "7px",
                }}
              >
                Add tags
              </span>
            </div>
            <Autocomplete
              disablePortal
              limitTags={1}
              id="tag"
              options={tagList}
              sx={{ width: 200 }}
              onChange={(e, value) =>
                setFormData({ ...formData, tag: value.id })
              }
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Choose Tags" />
              )}
            />
          </div>
          <div className="image-upload">
            <input
              style={{
                color: "#ffc107",
                marginTop: "25px",
                marginBottom: "5px",
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 30px 10px 0px",
                // borderRadius: "50px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              style={{
                padding: "9px 18px",
                border: "none",
                outline: "none",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "700",
                background: "#ffc107",
                color: "black",
                cursor: "pointer",
                opacity: ".9",
                //pointerEvents: 'none',
                transition: "background 0.2s ease",
              }}
              onClick={() =>
                setFormData({
                  ...formData,
                  image: image,
                })
              }
            >
              Upload Image
            </button>
          </div>
          <div className="Map-container">
            {mapToggle && (
              <MapContainer formData={formData} setFormData={setFormData} />
            )}
          </div>

          <div className="bottom">
            <ul className="icons">
              <li>
                <i
                  className="ri-map-pin-fill"
                  onClick={() => setMapToggle(!mapToggle)}
                ></i>
              </li>
            </ul>
            <div className="content">
              <span className="counter">{charCount}</span>
              <button
                disabled={charCount === 500}
                value={formData.handleSubmit}
                onClick={handleSubmit}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Concern, currLoc };
