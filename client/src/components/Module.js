import React, { useState } from "react";
import {useCookies} from 'react';

const Module = ({ mode, setShowModule,getData, task }) => {
  const [cookies,setCookies,removeCookies]=useCookies(null)
  const editMode = mode === 'edit'; // Determine edit mode based on prop 'mode'
  const [data, setData] = useState({
    user_email: editMode ? task.user_email :cookies.Email,
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date()
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/to`, 
       {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.status === 200) {
        setShowModule(false);
         getData();
      }

    } catch (err) {
      console.log(err);
    }
  };
  
  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/to/${task.id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.status === 200) {
        setShowModule(false);
        // Assuming getData is a function passed as a prop to fetch updated data
        // Replace getData with the correct function that fetches updated data
         getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>let's {mode} your task</h3>
          <button onClick={() => setShowModule(false)}>X</button>
        </div>
        <form onSubmit={editMode ? editData : postData}>
          <input
            required
            maxLength={30}
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br/>
          <label htmlFor="range">Drag to select your current progress</label>
          <input 
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input className={mode} type="submit" value={editMode ? 'Update' : 'Create'} />
        </form>
      </div>
    </div>
  );
};

export default Module;
