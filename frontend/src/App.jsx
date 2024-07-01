import React, { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

import FindEmails from "./pages/FindEmails";
import LinkedIn from "./pages/LinkedIn";

// Import pages
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/email" element={<FindEmails />} />
        <Route exact path="/linkedin" element={<LinkedIn />} />
      </Routes>
    </>
  );
}

export default App;
