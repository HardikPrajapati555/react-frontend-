import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    cloth: "",
    rentDuration: "",
    totalCost: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in and has the correct role
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Employee") {
      alert("Access denied: Only employees can create orders.");
      navigate("/login"); // Redirect to login page
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post("https://backend-api-a4xs.onrender.com/api/orders", formData, config);
      alert("Order created successfully!");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create order: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Create Order</h2>
      <input
        type="text"
        name="customerName"
        placeholder="Customer Name"
        value={formData.customerName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="cloth"
        placeholder="Cloth"
        value={formData.cloth}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="rentDuration"
        placeholder="Rent Duration (in days)"
        value={formData.rentDuration}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="totalCost"
        placeholder="Total Cost"
        value={formData.totalCost}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Order</button>
    </form>
  );
};

export default CreateOrder;
