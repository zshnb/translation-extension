import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from "./Popup";

const root = document.createElement("div")
root.className = "container"
root.style.width = '400px'
root.style.height = '300px'
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <Popup/>
  </React.StrictMode>
);
