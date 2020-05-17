import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";

const ENDPOINT = "http://localhost:3000"; //put this in another place to import

function App() {
  const [response, setResponse] = useState("");
  useEffect(() => {
    const socket = socketIOClient.connect(ENDPOINT);
    socket.on("tweet", data => {
      console.log("----", data);
      setResponse(data.tweet);
    });
  }, []);
  return (
    <div className="App">
      <h1>Receiving data from server...</h1>
      <p>{JSON.stringify(response, null, 0)}</p>
    </div>
  );
}

export default App;
