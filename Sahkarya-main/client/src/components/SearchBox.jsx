
import React, { useEffect, useState} from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import '../pages/concern.css';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  q: "",
  format: "json",
  addressdetails: "addressdetails",
};

export function SearchBox(props) {

  const { selectPosition, setSelectPosition, formData, setFormData,locationSelection, setLocationSelection} = props.sharedState;
  const [searchText, setSearchText] = useState("");

  const [pickedAddress, setAddress] = useState("");

  const [listPlace, setListPlace] = useState([]);
  
  useEffect(()=>{
    setFormData({...formData,address : pickedAddress});
  },[pickedAddress]) 
  const handleSearch = (value)=> {  
    setSearchText(value);  
    const params = {
                q: value,
                format: "json",
                addressdetails: 1,
                polygon_geojson: 0,
              };
              const queryString = new URLSearchParams(params).toString();
              const requestOptions = {
                method: "GET",
                redirect: "follow",
              };
              fetch(`${NOMINATIM_BASE_URL}${queryString}&limit=3`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                  setListPlace(JSON.parse(result));
                })
                .catch((err) => console.log("err: ", err)); 
  }
  const handleCordSearch = (coords)=>{

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let url = `${NOMINATIM_BASE_URL}q=${coords[0]}%2C${coords[1]}&format=jsonv2`
    console.log(url)
    fetch(`${NOMINATIM_BASE_URL}q=${coords[0]}%2C${coords[1]}&format=jsonv2`, requestOptions)

      .then((response) => response.text())
      .then((result) => {
        setSearchText(JSON.parse(result)[0].display_name);
      })
      .catch((err) => console.log("err: ", err));

    // setSearchText(display_name);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>

          <input type="text" class="form-control"

            style={{ width: "100%" }}
            value={searchText}
            onChange={(event) => {
              handleSearch(event.target.value);
            }}
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", padding: "0px 20px" }}
        >
          <button style={{padding: '9px 18px',
    border: 'none',
    outline: 'none',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '700',
    background: '#ffc107',
    color: 'black',
    cursor: 'pointer',
    opacity: '.9',
    transition: 'background 0.2s ease'}}
            
            onClick={() => {
              console.log("pic" + pickedAddress);

              console.log("loc " + locationSelection);
              setAddress(
                String(locationSelection[0]) +
                  " " +
                  String(locationSelection[1])
              );

              handleCordSearch(locationSelection);
              //Location picking funtion - yet to be made
            }}
          >
            Choose
          </button>
        </div>
      </div>
      <div id = "addressList">
        <List  component="nav" aria-label="main mailbox folders">
          {listPlace.map((item) => {
            return (
              <div key={item?.place_id}>
                <ListItem 

                  button
                  onClick={() => {
                    setSelectPosition(item);
                    setSearchText(item?.display_name);

                    setListPlace([]); //cleaning the list
                    

                  }}
                >
                  <ListItemIcon>
                    <img
                      src="./placeholder.png"
                      alt="Placeholder"
                      style={{ width: 38, height: 38 }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item?.display_name} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      </div>
    </div>
  );
}
