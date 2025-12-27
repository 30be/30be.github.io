import { Box, ListItem, ListItemIcon, Modal, Typography } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { cutName, MouseOverPopover } from "./utils";
import { Material, Mesh } from "three";
import React from "react";

// Dropdown
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { Listbox, MenuButton, MenuItem } from "./action_button";

export let materialToHighlight = "0-mtl-id";

export function PrimitiveModal(props: { prim: Mesh; onClose: () => void; open: boolean }) {
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
          Primitive watch
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {"Bounding box: " + JSON.stringify(props.prim.geometry.boundingBox)}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {"Primitive ID: " + JSON.stringify(props.prim.id)}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {"Material ID: " + JSON.stringify((props.prim.material as Material).id)}
        </Typography>
      </Box>
    </Modal>
  );
}
export function PrimitiveContainer(props: { prim: Mesh }) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const goMaterial = (mtlId) => {
    let mtlList = document.getElementById("MaterialsList");

    if (mtlList === null) {
      const mtlListHead = document.getElementById("MaterialsListHead");
      mtlListHead?.click();
      mtlListHead?.addEventListener("onexited", () => {
        materialToHighlight = mtlId + "-mtl-id";
        const mtlElem = document.getElementById(materialToHighlight);
        mtlElem?.focus();
      });
    }
  };

  return (
    <ListItem sx={{ pl: 4 }}>
      <ListItemIcon>
        <DataObjectIcon />
      </ListItemIcon>

      <Dropdown>
        <MenuButton>Actions</MenuButton>
        <Menu slots={{ listbox: Listbox }}>
          <MenuItem onClick={() => setModalOpen(true)}>Show primitive info</MenuItem>
          <MenuItem onClick={() => goMaterial((props.prim.material as Material).id)}>Go to material</MenuItem>
        </Menu>
      </Dropdown>
      <PrimitiveModal prim={props.prim} open={modalOpen} onClose={() => setModalOpen(false)}></PrimitiveModal>
      <MouseOverPopover buttonName={"Name: " + cutName(props.prim.name, 30)} popoverName={props.prim.name} />
    </ListItem>
  );
}
