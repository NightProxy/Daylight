
import './index.css';
import $ from 'jquery'
import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import React from 'react';

$(function () {
  $("#operaUserStyle").remove();
  //override any web modding extensions they may have (specifically opera)
});

function AppWithUI() {
  return (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement as Element);
root.render(<AppWithUI />);

