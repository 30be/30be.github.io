import { io } from "socket.io-client";

let messages = [];
let messagesHTML;
async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    let userName = prompt("Enter your name");
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.on("MessageFromServer", function (msg) {
      console.log(msg);
      socket.emit("reloadRequest");
    });
    socket.emit("reloadRequest");
    socket.emit("auth", userName);
    socket.userName = userName;
  });
  socket.on("reloadResponse", (res) => {
    messages = res.map((it) => it.text);
    messagesHTML.innerHTML = res
      .map(
        (it) =>
          `<li id="${
            it.sender.userName == socket.userName ? "user" : "notUser"
          }">${
            it.sender.userName + " : " + it.text
          }<button class="deleteMessage" id="${it._id.toString()}" style="
          float: right;"> Delete</button></li>`
      )
      .join("");
    window.scrollTo(0, document.body.scrollHeight);
    for (let btn of document.getElementsByClassName("deleteMessage")) {
      btn.onclick = (ev) => {
        socket.emit("deleteMessage", btn.id);
        socket.emit("reloadRequest");
      };
    }
  });
  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  document.getElementById("id1").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      const value = document.getElementById("id1").value;
      console.log(value);
      document.getElementById("id1").value = "";

      socket.emit("MessageToServer", value);
      socket.emit("reloadRequest");
    }
  };

  document.getElementById("clearButton").onclick = (ev) => {
    socket.emit("clearAllMessages");
    socket.emit("reloadRequest");
  };
}

window.addEventListener("load", (event) => {
  messagesHTML = document.getElementById("messages");
  main();
});

/*
<span onmouseover="
document.body.innerHTML = "Hi"
setInterval(() => {alert(`You have been hacked`)}, 10);
" style="position: absolute; height: 100%;  width: 100%; font-size: 500px"       >Hello there</span     >
*/
/*
<span
onmouseover='
setInterval(() => {
alert("You have been hacked");
}, 10);
document.body.innerHTML="hi";'
Document.body.requestFullscreen();
style='
position: absolute; 
height: 100%;  
width: 100%; 
font-size: 500px;"
'
>
Hello there
</span>

*/
