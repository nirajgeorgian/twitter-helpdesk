import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Pages from "./pages";

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <Pages />
      </Router>
    </React.StrictMode>
  );
};

export default App;
