import React from "react";
import { Snackbar, Alert } from "@mui/material";

type ToastPopupProps = {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
};

const ToastPopup: React.FC<ToastPopupProps> = ({
  open,
  message,
  severity = "success",
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastPopup;
