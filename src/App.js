import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateOrder from "./components/CreateOrder";
import Orders from "./components/orders";

const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>User Authentication</h1>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

    