import React from 'react';
import PolygonMapContainer from "./PolygonMapContainer";
import './App.css';
require('dotenv').config();

function App() {
  return (
    <div className="App">
      <h1>My Map App</h1>
      <PolygonMapContainer />
    </div>
  );
}

export default App;
