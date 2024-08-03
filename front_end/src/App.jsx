import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/Home";
import ChatPage from "./components/ChatPage";
import socketIO from "socket.io-client";
import { api } from "./api";
import { BASE_URL } from "./api";

// Establish a connection to the Socket.IO server
const socket = socketIO.connect(BASE_URL);

// Prevent the user from closing the browser window without confirmation
window.onbeforeunload = function () {
  return false;
};
function App() {
  const [title, setTitle] = useState("Exam Anxiety Discussion");
  
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route
            path="/chat"
            element={<ChatPage socket={socket} title={title} />}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
