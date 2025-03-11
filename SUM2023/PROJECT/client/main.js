import * as units from "./units/units.js";
import { shaderAdd } from "./rnd/shaders.js";
import { mouse, cam, ControlCamera } from "./utils/controls.js";
import * as controls from "./utils/controls.js";
import { loadObj } from "./rnd/prims.js";

import { io } from "socket.io-client";

const socket = io();

export let gl;
let canvas;

export let users = [];
let messagesHTML;

function userReloadResponse(res) {
  users = res;
}

function msgReloadResponse(res) {
  messagesHTML.innerHTML = res
    .map(
      (it) =>
        `<li class="message" id="${
          it.sender.userName == socket.userName ? "user" : "notUser"
        }">${it.sender.userName + " : " + it.text}
        <button class="deleteMessage" id="${it._id.toString()}" style="
        float: right; border-radius: 10px;"> Delete</button><span style="
        float: right;">${it.date}</span>
        </li>`
    )
    .join("");
  messagesHTML.scrollTo(0, messagesHTML.scrollHeight);
  window.scrollTo(0, messagesHTML.scrollHeight);
  document.getElementById("msgbox").scrollTop =
    document.getElementById("msgbox").scrollHeight;
  for (let btn of document.getElementsByClassName("deleteMessage")) {
    btn.onclick = () => {
      socket.emit("deleteMessage", btn.id);
      // socket.emit("reloadRequest");
    };
  }
}

function connect() {
  let userName = prompt("Enter your name");
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  socket.emit("reloadRequest");
  socket.emit("auth", userName);
  socket.userName = userName;
}

function setupSocket() {
  socket.on("connect", connect);
  socket.on("userReloadResponse", userReloadResponse);
  socket.on("msgReloadResponse", msgReloadResponse);
  socket.on("disconnect", () => {
    console.log("disconnected"); // undefined
  });
}

window.addEventListener("load", () => {
  messagesHTML = document.getElementById("messages");
  document.getElementById("id1").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      const value = document.getElementById("id1").value;
      console.log(value);
      document.getElementById("id1").value = "";
      socket.emit("MessageToServer", value);
    }
  };

  document.getElementById("clearButton").onclick = () => {
    socket.emit("clearAllMessages");
  };

  setupSocket();

  canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");

  initGL();
  window.onmousemove = controls.handleMouseMove;
  window.onmousedown = controls.handleMouseDown;
  window.onmouseup = controls.handleMouseUp;
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener("wheel", (event) => {
    controls.handleMouseZoom(event);
  });
  window.onscroll = () => window.scroll(0, 0);

  window.addEventListener("keyup", (event) => {
    controls.handleKeyUp(event);
  });
  window.addEventListener("keydown", (event) => {
    controls.handleKeyDown(event);
  });
  document.querySelector("#file").addEventListener("change", loadObj);

  function touchHandler(event) {
    var touches = event.changedTouches,
      first = touches[0],
      type = "";
    switch (event.type) {
      case "touchstart":
        type = "mousedown";
        break;
      case "touchmove":
        type = "mousemove";
        break;
      case "touchend":
        type = "mouseup";
        break;
      default:
        return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
      type,
      true,
      true,
      window,
      1,
      first.screenX,
      first.screenY,
      first.clientX,
      first.clientY,
      false,
      false,
      false,
      false,
      0 /*left*/,
      null
    );

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  }

  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
});

const draw = () => {
  gl.clearColor(0.8, 0.47, 0.3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(
    0,
    0,
    cam.frameW,
    cam.frameH
    //  Math.max(gl.canvas.width, gl.canvas.height)
  );
  units.render();

  ControlCamera();

  cam.setSize(canvas.width, canvas.height);
  //cam.frameH = canvas.height;
  //cam.frameW = canvas.width;
  cam.camSet(cam.loc, cam.at, cam.up, cam.pos, cam.userLoc);

  socket.emit("reloadRequest", cam);
  mouse.dx = mouse.dy = mouse.dz = 0; //костыль because idk how to see end of mouse move
  window.requestAnimationFrame(draw);
};

export async function initGL() {
  gl.clearColor(1, 1, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  //gl.enable(gl.CULL_FACE);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); /* Delete this mb*/
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ControlCamera();
  cam.setSize(canvas.width, canvas.height);
  cam.camSet(cam.loc, cam.at, cam.up, cam.pos, cam.userLoc);

  await shaderAdd("default");
  await units.init();
  document.getElementById("loading").style.visibility = "hidden";
  draw();
}
