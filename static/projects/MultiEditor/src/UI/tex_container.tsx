import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Typography } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import React, { useState } from "react";
import { Texture } from "three";
import * as THREE from "three";
import { rendererReference } from "three/examples/jsm/nodes/Nodes.js";
import { cutName, MouseOverPopover } from "./utils";

/* Render */
let renderer, scene, camera;
function Init() {
  renderer = new THREE.WebGLRenderer();

  renderer.setSize(400, 400);
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight("rgb(255,255,255)", 1));
  camera = new THREE.PerspectiveCamera();
  let texViewModal = document.getElementById("tex-view-modal");
  if (texViewModal !== null) {
    texViewModal.appendChild(renderer.domElement);
  } else {
    (texViewModal = document.body), texViewModal.appendChild(renderer.domElement);
  }
}

function texRndDisp() {
  // renderer.dispose();
}

function TextureRender(props: { tex: Texture; open: boolean }) {
  // Here
  const [imageURL, setImageURL] = useState("");
  const [divReady, setdivReady] = useState(false);

  React.useEffect(() => {
    if (!divReady) {
      Init();
      scene.background = props.tex;
      renderer.render(scene, camera);
      setImageURL(renderer.domElement.toDataURL("image/png"));
    }
  }, [props.tex]);
  //React.useEffect(() => {}, [imageURL]);
  // var anchor = document.createElement("a");
  // anchor.href = imageURL;
  // anchor.download = "preview.png";
  // anchor.click();

  // texViewModal.onclose = () => {};

  // anchor.remove();
  // props.tex.dispose();
  //
  // renderer.dispose();

  return (
    <div id="tex-view-modal">
      <a
        href={imageURL}
        ref={() => {
          setdivReady(true);
        }}
      >
        Get picture
      </a>
    </div>
  );
}

function TextureModal(props: { tex: Texture; onClose: () => void; open: boolean }) {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={props.open} onClose={props.onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Texture viewer
        </Typography>
        <TextureRender tex={props.tex} open={props.open} />
      </Box>
    </Modal>
  );
}

export function TextureContainer(props: { texture: Texture }) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <ListItem sx={{ pl: 4 }} key={props.texture.id}>
      <ListItemIcon>
        <DataObjectIcon />
      </ListItemIcon>
      <ListItemButton onClick={() => setModalOpen(true)}>Show</ListItemButton>
      <TextureModal
        tex={props.texture}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          texRndDisp();
        }}
      ></TextureModal>
      <MouseOverPopover buttonName={"Name: " + cutName(props.texture.name, 10)} popoverName={props.texture.name} />
      <ListItemText primary={"Id:" + props.texture.id} id={props.texture.name + props.texture.id} />
    </ListItem>
  );
}
