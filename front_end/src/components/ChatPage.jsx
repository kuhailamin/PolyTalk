import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { api } from "../api";

const ChatPage = ({ socket, title }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  let [searchParams, setSearchParams] = useSearchParams();
  const [sessionTime, setSessionTime] = useState(0);
  const room = searchParams.get("room");

  const WORD_PER_SECOND = 1;
  function calculateWritingTime(words) {
    const totalTime = words * WORD_PER_SECOND;
    return totalTime;
  }

  useEffect(() => {
    socket.on("messageResponse", (data) => {
        setMessages([...messages, data]); 
    });
  }, [socket, messages]);

  useEffect(() => {
    socket.on("typingResponse", (data) => {
      setTypingStatus(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("doneTypingResponse", () => setTypingStatus(""));
  }, [socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
