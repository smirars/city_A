import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Statistics from "./pages/Statistics";
import CreateCitizenPage from "./pages/CreateCitizenPage";
import FeedbackPage from "./pages/FeedbackPage";
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div style={{ flex: 1 }}>
        {currentPage === "home" && <Home />}
        {currentPage === "stats" && <Statistics />}
        {currentPage === "create" && <CreateCitizenPage />}
        {currentPage === "feedback" && <FeedbackPage />}
      </div>
    </div>
  );
}

export default App;
