import { useState, useEffect } from "react";

const ChatBar = ({ socket, room }) => {
  const [users, setUsers] = useState([]);

  // Fetch all users in the room when the component mounts
  useEffect(() => {
    socket.emit("fetchAllUsers", { room, id: socket.id });
  }, []);

  // Listen for updates to the list of users in the room
  useEffect(() => {
    socket.on("usersInRoom", (data) => {
      setUsers(data);
    });

    // When a new user joins, update the state and set the user's index in localStorage    
    socket.on("newUserResponse", (data) => {
      setUsers(data);
      const index = data?.findIndex(
        (user) => user.userName === localStorage.getItem("userName")
      );
      localStorage.setItem("index", index);
    });
  }, [socket, users]);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users?.map((user) => (
            <p
              style={{
                color:
                  user.userName == localStorage.getItem("userName")
                    ? "green"
                    : "",
              }}
              key={user.socketID}
            >
              {user.userName}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
