import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [channel, setChannel] = useState("1");

  const [moderator, setModerator] = useState("bot");
  const [admin, setAdmin] = useState(false);

  const handleChange = (e) => {
    if (e.target.value.trim().toLowerCase() === "admin") {
      setAdmin(true);
    } else setAdmin(false);
    setUserName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", userName);
    socket.emit("newUser", {
      userName,
      password,
      channel,
      socketID: socket.id,
      moderator,
    });
    navigate(`/chat?room=${channel}`);
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Name</label>
      <input
        type="text"
        minLength={2}
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={handleChange}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        type="text"
        minLength={6}
        name="password"
        id="password"
        className="username__input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {admin && (
        <>
          <label htmlFor="channel">Moderator</label>
          <select
            value={moderator}
            name=""
            id=""
            onChange={(e) => setModerator(e.target.value)}
          >
            <option value="bot">Bot</option>
            <option value="human">Human</option>
          </select>
        </>
      )}

      <label htmlFor="channel">Channel</label>
      <input
        type="number"
        name="channel"
        id="channel"
        min={0}
        max={400}
        onChange={(e) => setChannel(e.target.value)}
        required
      />

      <button className="home__cta">SIGN IN</button>
    </form>
  );
};

export default Home;
