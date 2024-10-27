import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./common.css";

const Sidebar = () => {
  return (
    <Navbar
      bg="primary"
      variant="dark"
      style={{
        height: "100vh",
        width: "250px",
        position: "fixed",
        boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.3)",
        flexDirection: "column",
      }}
    >
      <Navbar.Brand href="/" className="text-center mb-4 mt-3">
        Electric Vehicle Population
      </Navbar.Brand>
      <Nav className="flex-column ms-4" style={{ width: "100%" }}>
        <Link to="/" className="text-light sidebar-link">
          Table Data
        </Link>
        <Link to="/graphs" className="text-light sidebar-link">
          Graphs
        </Link>
        <Link to="/best" className="text-light sidebar-link">
          Best Data
        </Link>
      </Nav>
    </Navbar>
  );
};

export default Sidebar;
