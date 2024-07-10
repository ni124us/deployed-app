import Tickle from './Tickle';
import Progress from './Progress';
import { useState } from 'react';
import Module from './Module';

const Listcontent = ({ task,getData }) => {
  const [showModule, setShowModule] = useState(false);

  const deleteItem = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/to/${task.id}`, {
        method: 'DELETE'
      });
      
      if (response.status === 200) {
        // Replace with the correct function to fetch updated data after deletion
        // Example: getData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li className="content">
      <div className="info-container">
        <Tickle />  
        <p className="task-title">{task.title}</p>
        <Progress progress={task.progress} />
      </div>
      <div className="button-container">
        <button className="edit" onClick={() => setShowModule(true)}>EDIT</button>
        <button className="delete" onClick={deleteItem}>DELETE</button>
      </div>
      {showModule && <Module mode={'edit'} setShowModule={setShowModule} getData={getData} task={task} />}
    </li>
  );
};

export default Listcontent;
