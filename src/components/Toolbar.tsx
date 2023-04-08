import React, { useState } from 'react'
import '../styles/Toolbar.css'
import APIPopUp from './APIPopUp';

const Toolbar = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setIsPopUpOpen(!isPopUpOpen);
  };

  return (
    <div>
      <div id="toolbar">
          <button onClick={togglePopUp} id="api-button">API Key</button>
          <h1 id="app-name">GISTAR</h1>
          <button id="info-button">Info</button>
      </div>
      {isPopUpOpen && (
            <APIPopUp isPopUpOpen={isPopUpOpen} togglePopUp={togglePopUp} />
          )}
    </div>
  )
}

export default Toolbar