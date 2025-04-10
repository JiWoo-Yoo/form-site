// src/App.tsx
import React from "react";
import "./App.css";
import SurveyManager from "./SurveyManager";
import ToastPopup from "./ToastPopup";

const App: React.FC = () => {
  return (
    <div>
      <SurveyManager />
    </div>
  );
};

export default App;
