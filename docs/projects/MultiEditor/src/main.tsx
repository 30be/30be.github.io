import * as THREE from "three";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Render } from "./engine/render.js";
import NestedList from "./UI/nested_list.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { ModelType, modelTypes, Resources } from "./engine/resources.js";
import { GetFileModal } from "./UI/utils.js";
import { Add, Remove, QuestionMark } from "@mui/icons-material";
import { Box, Button, createTheme, MenuItem, Select, Slider, Stack, ThemeProvider, Typography, Modal, Fab, Link } from "@mui/material";

function RenderAndFileStat(props: { resources: Resources }) {
  const [render] = useState(new Render());

  return (
    <div>
      <RenderWindow primitives={props.resources.primitives} rnd={render}></RenderWindow>
      <FileStatictics rnd={render} resources={props.resources}></FileStatictics>
    </div>
  );
}

export function ExportButton(props: { resources: Resources }) {
  const [exportType, setExportType] = useState<ModelType>("g3dm");

  return (
    <>
      <Button
        onClick={() => {
          props.resources.export(exportType);
        }}
      >
        Export
      </Button>
      <Select id="export-filetype-select" value={exportType} onChange={(e) => setExportType(e.target.value as ModelType)}>
        {...modelTypes.map((mt) => <MenuItem value={mt}>{mt}</MenuItem>)}
      </Select>
    </>
  );
}
function FileStatictics(props: { rnd: Render; resources: Resources }) {
  const [value1, setValue1] = React.useState<number>(3000);
  const [value2, setValue2] = React.useState<number>(1);

  const myMarks1 = [
    {
      value: 1000,
      label: "1000",
    },
    {
      value: 10000,
      label: "10000",
    },
  ];
  const myMarks2 = [
    {
      value: 0.1,
      label: "0.1",
    },
    {
      value: 10,
      label: "10",
    },
  ];
  const fontTheme = createTheme({
    typography: {
      body1: {
        fontWeight: 500,
        fontStyle: "Impact, fantasy",
      },
    },
  });

  return (
    <div className="file-stat">
      <div>
        <ThemeProvider theme={fontTheme}>
          <Typography variant="body1">FarClip</Typography>
        </ThemeProvider>
        <Box sx={{ width: 250 }}>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Remove />
            <Slider
              aria-label="Volume"
              value={value1}
              min={1000}
              step={50}
              marks={myMarks1}
              max={10000}
              onChange={(e: Event, num: number | number[]) => {
                props.rnd.setFarClip(num as number);
                setValue1(num as number);
              }}
              valueLabelDisplay="auto"
            />
            <Add />
          </Stack>
        </Box>
      </div>
      <div>
        <ThemeProvider theme={fontTheme}>
          <Typography variant="body1">Nearclip</Typography>
        </ThemeProvider>
        <Box sx={{ width: 250 }}>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Remove />
            <Slider
              aria-label="Volume"
              value={value2}
              min={0.1}
              step={0.01}
              marks={myMarks2}
              max={10}
              onChange={(e: Event, num: number | number[]) => {
                props.rnd.setNearClip(num as number);
                setValue2(num as number);
              }}
              valueLabelDisplay="auto"
            />
            <Add />
          </Stack>
        </Box>
      </div>
      <ExportButton resources={props.resources}></ExportButton>
    </div>
  );
}
// Function that draws material ui icon "?" and displays modal on onClick
function Info() {
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

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Fab sx={{ position: "absolute", top: "3em", right: "3em" }}>
        <QuestionMark onClick={() => setModalOpen(true)} />
      </Fab>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <Typography variant="h3">3D model converter and viewer.</Typography>
          <Typography>Supported filetypes: {modelTypes.join(", ")}, MMD.</Typography>
          <Typography>
            Made by <Link href="https://github.com/Tim2303/">CGSG TM2</Link>, <Link href="https://github.com/LS4L/">CGSG LS4</Link> using React, Typescript and Three.js for the CGSG SummerPractice 2024.
          </Typography>
          <Typography>Drag a model, view it`s meshes, materials and textures, and export it.</Typography>
          <Typography>(Some features are not yet actually implemented.)</Typography>
        </Box>
      </Modal>
    </>
  );
}
function RenderWindow(props: { primitives: THREE.Group; rnd: Render }) {
  props.rnd.primitives = props.primitives;
  return <div className="render-window" id="render-window" ref={() => props.rnd.initWindow("render-window")}></div>;
}

// Not sure if this is really needed
function ResourcesList(props: { resources: Resources }) {
  const [active, setActive] = useState(false);
  const classes = active === true ? " res-list _active" : "res-list";

  return (
    <div
      className={classes}
      onDrop={(event) => {
        setActive(false);
        // if (!event.dataTransfer) return; // shouldnt ever go here
        // const files = Array.from(event.dataTransfer.files);
        // props.onAddFiles(files);
        cancel(event);
      }}
      onDragEnter={(e) => {
        setActive(true);
      }}
      onDragOver={cancel}
      onDragLeave={(e) => {
        setActive(false);
      }}
    >
      <NestedList models={props.resources.primitives.children as THREE.Mesh[]} textures={props.resources.textures} materials={props.resources.materials} />
    </div>
  );
}

function cancel(e) {
  e.preventDefault();
  e.stopPropagation();
}

function DragAndDrop(props: { onAddFiles: (files: File[]) => void }) {
  const [active, setActive] = useState(false);
  const classes = active === true ? " drag-n-drop _active" : "drag-n-drop";

  return (
    <div
      className={classes}
      onDrop={(event) => {
        setActive(false);
        if (!event.dataTransfer) return; // shouldnt ever go here
        const files = Array.from(event.dataTransfer.files);
        props.onAddFiles(files);
        cancel(event);
      }}
      onDragEnter={(e) => {
        setActive(true);
      }}
      onDragOver={cancel}
      onDragLeave={(e) => {
        setActive(false);
      }}
    >
      <div className="selector">
        <input
          id="selector-input"
          type="file"
          onChange={(event) => {
            const inputElement = document.getElementById("selector-input") as HTMLInputElement;
            if (!inputElement.files) return; // shouldnt ever go here
            const files = Array.from(inputElement.files);
            props.onAddFiles(files);
          }}
          style={{
            opacity: 0.0,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="70px" height="70px" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1 5C1 3.34315 2.34315 2 4 2H8.43845C9.81505 2 11.015 2.93689 11.3489 4.27239L11.7808 6H13.5H20C21.6569 6 23 7.34315 23 9V11C23 11.5523 22.5523 12 22 12C21.4477 12 21 11.5523 21 11V9C21 8.44772 20.5523 8 20 8H13.5H11.7808H4C3.44772 8 3 8.44772 3 9V10V19C3 19.5523 3.44772 20 4 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H4C2.34315 22 1 20.6569 1 19V10V9V5ZM3 6.17071C3.31278 6.06015 3.64936 6 4 6H9.71922L9.40859 4.75746C9.2973 4.3123 8.89732 4 8.43845 4H4C3.44772 4 3 4.44772 3 5V6.17071ZM20.1716 18.7574C20.6951 17.967 21 17.0191 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C17.0191 21 17.967 20.6951 18.7574 20.1716L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L20.1716 18.7574ZM13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16Z"
            fill="#5CD38E"
          />
        </svg>
      </div>
      <div className="tile-text">Drag'n'drop</div>
    </div>
  );
}

function App() {
  const [resources, setResources] = useState(new Resources());
  const [isResourcesUpdated, setIsResourcesUpdated] = useState(false); // ????
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [getFileFromModal, setGetFileFromModal] = useState<(value: File | null) => void>();
  console.log("App recomposition");

  React.useEffect(() => {
    setIsResourcesUpdated(false); // This code is a bug as it makes the app recompose twice.
  }, [isResourcesUpdated]);

  const requestFileFromModal = async (url: string): Promise<File | null> => {
    return new Promise<File | null>((resolve) => {
      setGetFileFromModal(() => resolve); // When getActualFiles is called, promise returns and requestFile executes further

      // TODO This (probably) code has a bug: When secoond model is added, getFilesFromModal can change
      setFileUrl(url); // Maybe this piece of code will change some state, and then re-render the whole app, which is bad
    });
  };
  const handleAddFiles = async (files) => {
    await Promise.all(files.map((file) => resources.addFile(file, requestFileFromModal)));
    setResources(resources);
    setIsResourcesUpdated(true); // How s it work
  };
  return (
    <>
      <DragAndDrop onAddFiles={(files) => handleAddFiles(files)} />
      <ResourcesList resources={resources} />
      <RenderAndFileStat resources={resources} />
      <GetFileModal
        url={fileUrl}
        onAddFiles={
          (file) => (setFileUrl(null), getFileFromModal ? getFileFromModal(file) : alert("Logical error: getFileFromModel undefined")) // Actually, resolve will be called.
        }
      ></GetFileModal>
      <Info></Info>
    </>
  );
}

async function onLoad() {
  const rootElement = document.getElementById("root") as HTMLDivElement | null;
  if (rootElement !== null) {
    const root = createRoot(rootElement);
    root.render(WebGL.isWebGLAvailable() ? <App /> : WebGL.getWebGLErrorMessage());
  }
}

window.onload = onLoad;
