import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Statistics from "./pages/Statistics";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div style={{ flex: 1 }}>
        {currentPage === "home" && <Home />}
        {currentPage === "stats" && <Statistics />}
      </div>
    </div>
  );
}

export default App;
