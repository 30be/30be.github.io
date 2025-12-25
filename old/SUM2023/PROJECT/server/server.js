const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017"; /*192.168.30.75 */
const client = new MongoClient(uri);

const database = client.db("LS4_chat");
const messages = database.collection("messages");
//const users = database.collection("users");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

const clients = [];
const cams = [];
io.on("connection", (socket) => {
  socket.isChanged = true;
  clients.push(socket);
  cams.push(null);
  let res = messages.find().toArray();
  res.then((it) => {
    console.log(it);
    socket.emit("msgReloadResponse", it);
    socket.isChanged = false;
  });
  console.log(`Client connected with id: ${socket.id}`);

  socket.on("MessageToServer", (msg) => {
    console.log(msg);
    let date = new Date();
    messages.insertOne({
      sender: { userName: socket.userName, id: socket.id },
      text: msg,
      date:
        date.getDate() +
        "-" +
        date.getMonth() +
        "-" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes(),
    });
    clients.forEach((client) => {
      client.isChanged = true;
    });
  });

  socket.on("reloadRequest", (cam) => {
    if (cam != undefined) {
      cam.userName = socket.userName;
      cams[clients.indexOf(socket)] = cam;
    }
    //console.log(clients);
    socket.emit("userReloadResponse", cams);

    if (socket.isChanged) {
      let res = messages.find().toArray();
      res.then((it) => {
        console.log(it);
        socket.emit("msgReloadResponse", it);
      });
      socket.isChanged = false;
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
      cams.splice(index, 1);
    }
  });
  socket.on("auth", (name) => {
    socket.userName = name;

    //should not be here
    socket.emit("userReloadResponse", cams);

    let res = messages.find().toArray();
    res.then((it) => {
      console.log(it);
      socket.emit("msgReloadResponse", it);
    });
    socket.isChanged = false;
  });

  socket.on("deleteMessage", (messageId) => {
    messages.findOneAndDelete({ _id: new ObjectId(messageId) });
    clients.forEach((client) => {
      client.isChanged = true;
    });
  });
  socket.on("clearAllMessages", () => {
    if (socket.userName == "ls4") messages.deleteMany();
    clients.forEach((client) => {
      client.isChanged = true;
    });
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
