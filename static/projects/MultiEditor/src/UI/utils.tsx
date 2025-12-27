import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Box, Button, Modal } from "@mui/material";

export function cutName(name: string, size: number) {
  if (name.length === 0) {
    return "'No name'";
  } else if (Math.min(name.length, size) == size) {
    return name.substring(0, size - 3) + "...";
  } else {
    return name.substring(0, name.length);
  }
}

export function MouseOverPopover(props: { buttonName: string; popoverName: string }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography aria-owns={open ? "mouse-over-popover" : undefined} aria-haspopup="true" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        {props.buttonName}
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{props.popoverName}</Typography>
      </Popover>
    </div>
  );
}

export function GetFileModal(props: { onAddFiles: (file: File | null) => void; url: string | null | undefined }) {
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
  function cancel(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  return (
    <Modal open={props.url !== null} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        {/* TODO: Not tested! */}
        <div
          className={"dropDiv"}
          onDrop={(event) => {
            //setActive(false);
            if (!event.dataTransfer) return; // shouldnt ever go here

            cancel(event);
            const file = event.dataTransfer.files.item(0);
            if (file) props.onAddFiles(file);
          }}
          onDragEnter={(e) => {
            //setActive(true);
          }}
          onDragOver={cancel}
          onDragLeave={(e) => {
            //setActive(false);
          }}
        ></div>
        <Typography>{"Add file {" + props.url + "} here: "}</Typography>
        <div>
          <input
            id="error-re-drop"
            type="file"
            onChange={(event) => {
              const inputElement = document.getElementById("error-re-drop") as HTMLInputElement;
              if (!inputElement.files) return;
              const files = Array.from(inputElement.files);
              props.onAddFiles(files[0]);
            }}
            //accept="image/png, image/jpeg"
          ></input>
        </div>
        <Button
          onClick={() => {
            props.onAddFiles(null);
          }}
        >
          Ignore this file
        </Button>
      </Box>
    </Modal>
  );
}
