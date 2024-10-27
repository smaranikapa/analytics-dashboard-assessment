import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./dashboard/common/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "./dashboard/pages/Table";
import Graph from "./dashboard/pages/Graph";
import Best from "./dashboard/pages/Best";

function App() {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/graphs" element={<Graph />} />
          <Route path="/best" element={<Best />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
