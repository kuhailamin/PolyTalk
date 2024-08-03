import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { api } from "../api";

// ChatPage component displays the chat interface, including the chat bar, chat body, and chat footer.
const ChatPage = ({ socket, title }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  let [searchParams, setSearchParams] = useSearchParams();
  const [sessionTime, setSessionTime] = useState(0);
  const room = searchParams.get("room");

  const WORD_PER_SECOND = 1;
  /**
   * Calculate the time required to write a given number of words.
   * @param {number} words - The number of words.
   * @returns {number} - The total time required in seconds.
   */
  function calculateWritingTime(words) {
    const totalTime = words * WORD_PER_SECOND;
    return totalTime;
  }

  // Handles incoming messages and updates the messages state.
  useEffect(() => {
    socket.on("messageResponse", (data) => {
        setMessages([...messages, data]); 
    });
  }, [socket, messages]);

  // Handles typing status and updates the typingStatus state.
  useEffect(() => {
    socket.on("typingResponse", (data) => {
      setTypingStatus(data);
    });
  }, [socket]);

  // Handles the event when typing is done and clears the typingStatus state.
  useEffect(() => {
    socket.on("doneTypingResponse", () => setTypingStatus(""));
  }, [socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetches the chat session duration from the server and updates the sessionTime state.
  useEffect(() => {
    async function fetchChatSession() {
      try {
        const {
          data: { session },
        } = await api.get("/chatSession");
        setSessionTime(+session);
      } catch (error) {
        console.log(error);
      }
    }
    fetchChatSession();
  }, []);
  return (
    <div className="chat">
      <ChatBar socket={socket} room={room} />
      <div className="chat__main">
        <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
          room={room}
          title={title}
          socket={socket}
          sessionTime={sessionTime}
          setSessionTime={setSessionTime}
        />
        <ChatFooter socket={socket} room={room} />
      </div>
    </div>
  );
};

export default ChatPage;
