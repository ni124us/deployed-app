import Module from "./Module";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

const ListHead = ({ listname, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null); // Ensure correct cookie names are provided
  const [showModule, setShowModule] = useState(false);


  const signout = () => {
    console.log('signout');
    removeCookie('Email'); // Corrected function name to removeCookie
    removeCookie('AuthToken');
    window.location.reload();
  };

  return (
    <div className="list-head">
      <h1>{listname}</h1>
      <div className="button-container">
        <button className="create" onClick={() => setShowModule(true)}>ADD NEW</button>
        <button className="signout" onClick={signout}>SIGN OUT</button> {/* Corrected onClick handler */}
      </div>
      {showModule && <Module mode={'create'} setShowModule={setShowModule} getData={getData}/>}
    </div>
  );
};

export default ListHead;

