/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import loading from "../assets/circle-1700_256.gif";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Reply from "./Reply";
import { colors } from "../../constants";
import axios from "axios";
import { BASE_URL } from "../api";

const linkRenderer = (props) => {
  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
};

const ChatBody = ({
  messages,
  typingStatus,
  lastMessageRef,
  room,
  title,
  socket,
  sessionTime,
  setSessionTime,
}) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(false);
  const [users, setUsers] = useState([]);
  const [countdown, setCountdown] = useState(0);

  const [start, setStart] = useState(
    localStorage.getItem("userName").trim().toLowerCase() === "admin"
  );
  useEffect(() => {
    socket.on("timerStarted", (data) => {
      setTimer(true);
      // if (data?.date) {
      //   setSessionTime((prevSessionTime) => {
      //     const currentDubaiTime = new Date().toLocaleString("en-US", {
      //       timeZone: "Asia/Dubai",
      //     });

      //     console.log(currentDubaiTime);

      //     // Convert data.date to a Date object in Dubai timezone
      //     const dubaiDate = new Date(data.date);
      //     const dubaiTime = dubaiDate.toLocaleString("en-US", {
      //       timeZone: "Asia/Dubai",
      //     });

      //     console.log(
      //       dubaiTime,
      //       // new Date(currentDubaiTime).getTime(),
      //       // new Date(currentDubaiTime),
      //       // new Date(dubaiTime),
      //       "data.date",
      //       data?.date
      //     );

      //     // Get the time in milliseconds for the Dubai date
      //     const dubaiTimeMilliseconds = new Date(dubaiTime).getTime();

      //     // Calculate the time difference in seconds
      //     const timeDifferenceInSeconds =
      //       (new Date(currentDubaiTime).getTime() - dubaiTimeMilliseconds) /
      //       1000;
      //     const calculatedTime = prevSessionTime - timeDifferenceInSeconds;
      //     // console.log(
      //     //   "sessionTime before setSessionTime",
      //     //   prevSessionTime,
      //     //   "calculatedTime",
      //     //   calculatedTime
      //     // );
      //     return calculatedTime;
      //   });
      // }
    });
  }, [socket]);

  useEffect(() => {
    const checkTimer = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "timeLeft?channel=" + room);
        console.log(data.time, sessionTime);
        setCountdown(Math.floor(sessionTime - data.time));
      } catch (error) {
        console.log(error);
      }
    };

    if (!timer) return;

    const intervalId = setInterval(checkTimer, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await axios.get(`${BASE_URL}users?room=${room}`);
        setUsers(data?.users);
        console.log(users);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("quit", () => {
      localStorage.removeItem("userName");
      localStorage.removeItem("index");
      navigate("/");
      window.location.reload();
    });
  }, [socket]);

  const handleLeaveChat = () => {
    socket.emit("leave", {
      channel: room,
      name: localStorage.getItem("userName"),
      id: socket.id,
    });
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload();
  };

  const handleEndChat = () => {
    socket.emit("end", {
      channel: room,
      name: localStorage.getItem("userName"),
      id: socket.id,
    });
  };

  const handleTimerUpdate = (remainingTime) => {
    if (remainingTime == 20) {
      socket.emit("wrapUp", {
        channel: room,
      });
    }
  };
  const handleStartChat = () => {
    socket.emit("start", {
      channel: room,
      name: localStorage.getItem("userName"),
      id: socket.id,
    });
    setStart(false);
  };

  function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  }
  // console.log(users, messages);
  return (
    <>
      <header className="chat__mainHeader">
        <p>{title}</p>
        <CountdownCircleTimer
          size={60}
          isPlaying={timer}
          duration={sessionTime}
          colors={["#7CFC00", "#FFA500", "#A30000"]}
          colorsTime={[300, 50, 0]}
          onUpdate={handleTimerUpdate}
          onComplete={() => console.log("completed")}
        >
          {({ remainingTime }) =>
            timer ? fancyTimeFormat(countdown) : fancyTimeFormat(sessionTime)
          }
        </CountdownCircleTimer>
        <div>
          {start && (
            <button className="start__btn" onClick={handleStartChat}>
              Start
            </button>
          )}
          {localStorage.getItem("userName").trim().toLowerCase() ===
            "admin" && (
            <button className="leaveChat__btn" onClick={handleEndChat}>
              End Chat
            </button>
          )}
          <button className="leaveChat__btn" onClick={handleLeaveChat}>
            Leave Chat
          </button>
        </div>
      </header>

      <div className="message__container">
        {messages.map((message) => {
          const index = users.findIndex(
            (user) => user.userName == message.name
          );
          return message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div
                className="message__sender"
                style={{
                  backgroundColor:
                    message?.name == "The Moderator"
                      ? "#f2f295"
                      : colors[
                          users.findIndex(
                            (user) => user.userName == message.name
                          )
                        ],
                }}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
                >
                  {message.text}
                </Markdown>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              {message?.replyTo ? (
                <Reply
                  text={message?.text}
                  name={message?.author}
                  original={message?.replyTo}
                  users={users}
                />
              ) : (
                <div
                  className="message__recipient"
                  style={{
                    backgroundColor:
                      message?.name == "The Moderator"
                        ? "f2f295"
                        : colors[
                            users.findIndex(
                              (user) => user.userName == message.name
                            )
                          ],
                  }}
                >
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      [rehypeExternalLinks, { target: "_blank" }],
                    ]}
                  >
                    {message.text}
                  </Markdown>
                </div>
              )}
            </div>
          );
        })}
        <div className="message__status">
          {typingStatus && <img src={loading} alt="" width={20} height={20} />}
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
