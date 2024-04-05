require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { askGPT } = require("./config");
const http = require("http").Server(app);
const mongoose = require("mongoose");
const chat = require("./model/chat");
const gptContent = require("./model/content");
const appTitle = require("./model/AppTitle");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
app.use(cors());
app.use(express.json());
let users = {};
let messages = {};
let chatBotActive = {};
let chatSessionStart = {};
const { CHAT_SESSION, BOT_NAME, TIMEZONE } = require("./constants");

const WORD_PER_SECOND = 0.2;

function calculateWritingTime(words) {
  const totalTime = words * WORD_PER_SECOND;
  return totalTime;
}

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("start", (data) => {
    if (users[data?.channel].length === 3) {
      let usersName = users[data?.channel]
        .filter((user) => user.userName.toLowerCase() !== "admin")
        .map((user) => user.userName);

      socketIO.to(data?.channel).emit(
        "messageResponse",

        {
          text: `Welcome,  ${usersName}\n, to our conversation session focused on exam anxiety. \n This is a safe and open space to share your experiences, thoughts, \n and strategies related to this topic. As we go through our discussion, feel free to express your viewpoints and listen to each other's perspectives
          `,
          name: BOT_NAME,
          channel: data?.channel,
        }
      );
      chatSessionStart[data?.channel] = new Date().getTime();
      // console.log(
      //   new Date(),
      //   new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
      // );
      socketIO.to(data?.channel).emit("timerStarted", {
        session: CHAT_SESSION,
        date: new Date().toLocaleString("en-US", { timeZone: TIMEZONE }),
      });
    }
  });

  socket.on("wrapUp", async (data) => {
    messages[data.channel].push({
      role: "system",
      content: "That is it for the discussion. Please wrap it up",
    });
    let usersName = users[data?.channel]
      .filter((user) => user.userName.toLowerCase() !== "admin")
      .map((user) => user.userName);
    socketIO.to(data.channel).emit("typingResponse", "Moderator is typing");
    const gptResponse = await askGPT(
      messages[data.channel],
      `Please act as a conversation moderator with the following users: ${usersName}. The topic of the conversation is exam anxiety. dont simulate the conversation. just wait for a response from one of the users. Don't respond at all If the user is addressing another user in the conversation. Don't repeat yourself. Also be short and to the point. Don't use more than 4 lines at most.`
    );
    socketIO.to(data?.channel).emit("messageResponse", {
      text: gptResponse,
      name: BOT_NAME,
      id: "vdakzDb7DGWGO6yXAAAD0.5910847039645001",
      socketID: "902olsd",
      channel: data.channel,
    });
    socketIO.to(data.channel).emit("doneTypingResponse");
  });

  socket.on("message", async (data) => {
    if (!messages[data.channel]) {
      messages[data.channel] = [];
    }
    // const newChat = new chat({
    //   author: data.name,
    //   text: data.text,
    //   channel: data.channel,
    // });
    // await newChat.save();
    socketIO.to(data?.channel).emit("messageResponse", data);

    if (users[data?.channel].length >= 3 && chatBotActive[data.channel]) {
      messages[data.channel].push({
        role: "user",
        content: `${data.name} said ${data.text}`,
      });
      let usersName = users[data?.channel]
        .filter((user) => user.userName.toLowerCase() !== "admin")
        .map((user) => user.userName);
      socketIO.to(data?.channel).emit("typingResponse", "Moderator is typing");
      const gptResponse = await askGPT(
        messages[data.channel],
        `Please act as a conversation moderator with the following users: ${usersName}. The topic of the conversation is exam anxiety. dont simulate the conversation. just wait for a response from one of the users. Address users by name using the @ sign. Don't respond at all If the user is addressing another user in the conversation. Also be short and to the point. Don't use more than 4 lines at most`
      );
      // const gptChat = new chat({
      //   author: "bot",
      //   text: gptResponse,
      //   channel: data.channel,
      // });
      // await gptChat.save();
      const time_delay =
        calculateWritingTime(gptResponse.split(/\s+/).length) * 1000;

      setTimeout(() => {
        socketIO.to(data?.channel).emit("messageResponse", {
          text: gptResponse,
          name: BOT_NAME,
          id: "vdakzDb7DGWGO6yXAAAD0.5910847039645001",
          socketID: "902olsd",
          channel: data.channel,
          replyTo: data.text,
          author: data.name,
        });
        socketIO.to(data.channel).emit("doneTypingResponse");
      }, time_delay);
    }
  });

  socket.on("end", (data) => {
    const { channel } = data;
    socketIO.to(channel).emit("quit");
    users[channel] = [];
    chatBotActive[channel] = false;
    if (users[channel]) {
      delete messages[channel];
    }
  });

  socket.on("typing", (data) => {
    socket.broadcast.to(data?.channel).emit("typingResponse", data?.message);
  });

  socket.on("doneTyping", (data) =>
    socket.broadcast.to(data?.channel).emit("doneTypingResponse", data?.message)
  );

  socket.on("newUser", async (data) => {
    const { userName, password, channel, socketID, moderator } = data;
    console.log(data);
    if (!users[channel]) {
      users[channel] = [];
    }
    data["index"] = users[channel].length;
    users[channel].push(data);
    socket.join(channel);
    socketIO.to(channel).emit("newUserResponse", users[channel]);
    if (userName.trim().toLowerCase() === "admin") {
      if (moderator === "bot") chatBotActive[channel] = true;
    }

    // const newActivity = new activity({
    //   name: userName,
    //   channel,
    //   text: "join",
    // });
    // await newActivity.save();
  });

  socket.on("fetchAllUsers", ({ room, id }) => {
    socketIO.to(id).emit("usersInRoom", users[room]);
  });

  socket.on("leave", async ({ channel, name, id }) => {
    users[channel] = users[channel].filter((user) => user.socketID !== id);
    socketIO.to(channel).emit("usersInRoom", users[channel]);
    if (name === "admin") {
      chatBotActive[channel] = false;
      chatSessionStart[channel] = null;
    }
    // const newActivity = new activity({
    //   name,
    //   channel,
    //   text: "left",
    // });
    if (users[channel]) {
      delete messages[channel];
    }
    // await newActivity.save();
  });

  socket.on("disconnect", (data) => {
    console.log("🔥: A user disconnected", data);
    // users = users.filter((user) => user.socketID !== socket.id);
    // socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello" });
});

app.get("/chat", async (req, res) => {
  const chats = await chat.find({});
  res.json(chats);
});

app.get("/chatTitle", async (req, res, next) => {
  const { title } = await appTitle.findOne();
  res.status(200).json(title);
});

app.get("/content", async (req, res) => {
  const result = await gptContent.find();
  res.status(200).json(result);
});

app.put("/content", async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(422).json({ message: "Please enter content!!!" });
    // const value = await gptContent.findOne({ key: 1 });
    // value.set({ text: content });
    // await value.save();
    res.status(200).json({ message: value });
  } catch (error) {
    console.log(error);
  }
});

app.put("/chatTitle", async (req, res, next) => {
  const { title } = req.body;
  if (!title) return res.status(422).json({ message: "Please enter title" });
  const newTitle = await appTitle.findOne({ key: 1 });
  newTitle.set({
    title,
  });
  await newTitle.save();
  res.status(200).json({ message: "succes" });
});

app.get("/users", (req, res) => {
  const { room } = req.query;
  res.status(200).json({ users: users[room] });
});

app.get("/chatSession", (req, res, next) => {
  res.status(200).json({
    session: CHAT_SESSION,
  });
});

app.get("/timeLeft", (req, res, next) => {
  const { channel } = req.query;
  if (channel && chatSessionStart[channel]) {
    const timeLeft = (new Date().getTime() - chatSessionStart[channel]) / 1000;
    res.status(200).json({
      time: timeLeft,
    });
  }
});

http.listen(process.env.PORT || 4000, async () => {
  // await mongoose.connect(
  //   "mongodb+srv://polyadic:1wh7eatRE86Yb4Bs@cluster0.p20nujc.mongodb.net/?retryWrites=true&w=majority"
  // );
  // const title = await appTitle.findOne();
  // if (!title) {
  //   const newTitle = new appTitle();
  //   await newTitle.save();
  // }
  // const content = await gptContent.findOne();
  // if (!content) {
  //   const newContent = new gptContent();
  //   await newContent.save();
  // }
  console.log(`Server listening on ${process.env.PORT}`);
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
});
