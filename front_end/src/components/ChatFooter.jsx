import React, { useState } from "react";

// ChatFooter component handles sending messages and notifying about typing status.
const ChatFooter = ({ socket, room }) => {
  const [message, setMessage] = useState("");

  // Handles the typing event by emitting a "typing" event to the server.
  const handleTyping = () =>
    socket.emit("typing", {
      message: `${localStorage.getItem("userName")} is typing`,
      channel: room,
    });

   /**
   * Handles sending the message by emitting a "message" event to the server and resetting the message input.
   * @param {Event} e - The event object.
   */
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
