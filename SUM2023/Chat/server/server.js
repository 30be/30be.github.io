const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017"; /*192.168.30.75 */
const client = new MongoClient(uri);

const database = client.db("LS4_chat");
const messages = database.collection("messages");
const users = database.collection("users");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

const clients = [];

io.on("connection", (socket) => {
  clients.push(socket);
  console.log(`Client connected with id: ${socket.id}`);
  socket.on("MessageToServer", (msg) => {
    const replyMsg = msg;
    console.log(replyMsg);
    for (let client of clients) {
      if (client === socket) {
        continue;
      }
      client.emit("MessageFromServer", replyMsg);
    }
    messages.insertOne({
      sender: { userName: socket.userName, id: socket.id },
      text: msg,
    });
  });
  socket.on("auth", (name) => {
    socket.userName = name;
  });
  socket.on("deleteMessage", (messageId) => {
    messages.findOneAndDelete({ _id: new ObjectId(messageId) });
  });
  socket.on("clearAllMessages", (msg) => {
    if (socket.userName == "ls4") messages.deleteMany();
  });
  socket.on("reloadRequest", (msg) => {
    let res = messages.find().toArray();
    res.then((it) => {
      console.log(it);
      socket.emit("reloadResponse", it);
    });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
