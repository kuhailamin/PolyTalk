import React, { useState } from "react";

const ChatFooter = ({ socket, room }) => {
  const [message, setMessage] = useState("");
  const handleTyping = () =>
    socket.emit("typing", {
      message: `${localStorage.getItem("userName")} is typing`,
      channel: room,
    });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      socket.emit("message", {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        channel: room,
      });
      socket.emit("doneTyping", {
        name: `${localStorage.getItem("userName")}`,
        channel: room,
      });
    }
    setMessage("");
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
