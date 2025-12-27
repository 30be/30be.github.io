import React from "react";

/* MUI nested list elements */
import { createTheme, ThemeProvider } from "@mui/material/styles";

// List members
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
// Panels
import ConstructionIcon from "@mui/icons-material/Construction"; // Models panel
import PanoramaIcon from "@mui/icons-material/Panorama"; // Textures panel
import ColorLensIcon from "@mui/icons-material/ColorLens"; // Material panel
// Expand commands
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Material, Mesh, Texture } from "three";

/* Containers */
import { PrimitiveContainer } from "./prim_container";
import { MaterialContainer } from "./mtl_container";
import { TextureContainer } from "./tex_container";

const myTheme = createTheme({
  palette: {
    primary: {
      main: "#238554",
    },
    secondary: {
      main: "#4AC77E",
    },
  },
});

function ResourceList(props: { children?: React.ReactNode; icon: React.ReactNode; text: string; name: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)} id={props.name + "Head"}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit id={props.name}>
        <List component="div" disablePadding>
          {props.children}
        </List>
      </Collapse>
    </>
  );
}

export default function NestedList(props: { models: Mesh[]; textures: Texture[]; materials: Material[] }) {
  console.log("NestedList props:", props);
  return (
    // What does theme provider do?
    <ThemeProvider theme={myTheme}>
      <List
        sx={{ width: "100%", height: "99%" }}
        subheader={
          <ThemeProvider theme={myTheme}>
            <ListSubheader color="primary">Loaded object items</ListSubheader>
          </ThemeProvider>
        }
      >
        <ResourceList icon={<ConstructionIcon />} text="Primitives" key="Primitives" name="PrimitivesList">
          {props.models.map((model) => (
            <PrimitiveContainer prim={model} key={model.id}></PrimitiveContainer>
          ))}
        </ResourceList>
        <ResourceList icon={<PanoramaIcon />} text="Materials" key="Materials" name="MaterialsList">
          {props.materials.map((material) => (
            <MaterialContainer material={material} key={material.id}></MaterialContainer>
          ))}
        </ResourceList>
        <ResourceList icon={<ColorLensIcon />} text="Textures" key="Textures" name="TexturesList">
          {props.textures.map((texture) => (
            <TextureContainer texture={texture} key={texture.id}></TextureContainer>
          ))}
        </ResourceList>
      </List>
    </ThemeProvider>
  );
}
