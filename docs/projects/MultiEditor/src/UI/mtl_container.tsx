import { Box, ListItem, ListItemIcon, ListItemText, Modal, Typography } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { cutName, MouseOverPopover } from "./utils";
import { Material, MeshPhongMaterial } from "three";
import React from "react";
import { Dropdown, Menu } from "@mui/base";
import { Listbox, MenuButton, MenuItem } from "./action_button";

export function MaterialModal(props: { mtl: Material; onClose: () => void; open: boolean }) {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "60%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const GetTypo = (props: { mainStr: string; stringif: any }) => {
    return (
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        {props.mainStr + JSON.stringify(props.stringif)}
      </Typography>
    );
  };

  return (
    <Modal open={props.open} onClose={props.onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <GetTypo mainStr="Material ID: " stringif={(props.mtl as Material).id}></GetTypo>
        <GetTypo mainStr="Is transparent: " stringif={(props.mtl as Material).transparent}></GetTypo>
        <GetTypo mainStr="Blend color: " stringif={(props.mtl as Material).blendColor}></GetTypo>
        <GetTypo mainStr="Vertex colors: " stringif={(props.mtl as Material).vertexColors}></GetTypo>
        <GetTypo mainStr="Material type: " stringif={(props.mtl as Material).type}></GetTypo>
        {/* Phong coefficients */}
        {(props.mtl as Material).type === "MeshPhongMaterial" ? (
          <div>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Phong coefficients
            </Typography>
            <GetTypo mainStr="Ka: " stringif={"#" + (props.mtl as MeshPhongMaterial).emissive.getHexString()}></GetTypo>
            <GetTypo mainStr="Kd: " stringif={"#" + (props.mtl as MeshPhongMaterial).color.getHexString()}></GetTypo>
            <GetTypo mainStr="Ks: " stringif={"#" + (props.mtl as MeshPhongMaterial).specular.getHexString()}></GetTypo>
            <GetTypo mainStr="Ph: " stringif={(props.mtl as MeshPhongMaterial).shininess}></GetTypo>
            <GetTypo mainStr="Opasity: " stringif={(props.mtl as MeshPhongMaterial).opacity}></GetTypo>
          </div>
        ) : (
          <></>
        )}
      </Box>
    </Modal>
  );
}
export function MaterialContainer(props: { material: Material }) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <ListItem sx={{ pl: 4 }} id={props.material.id + "-mtl-id"}>
      <ListItemIcon>
        <DataObjectIcon />
      </ListItemIcon>
      <Dropdown>
        <MenuButton>Actions</MenuButton>
        <Menu slots={{ listbox: Listbox }}>
          <MenuItem onClick={() => setModalOpen(true)}>Material info</MenuItem>
        </Menu>
      </Dropdown>
      <MaterialModal mtl={props.material} open={modalOpen} onClose={() => setModalOpen(false)} />
      <MouseOverPopover buttonName={"Name: " + cutName(props.material.name, 20)} popoverName={props.material.name} />
    </ListItem>
  );
}
