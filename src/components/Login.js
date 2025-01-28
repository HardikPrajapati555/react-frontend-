import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://backend-api-a4xs.onrender.com/api/users/login", formData);
  
      // Ensure you're accessing the correct response structure
      const { token, role } = response.data;
  
      // Save token and role to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      alert("Login successful!");
      console.log(response.data);
  
      // Redirect to the create-order page
    //   navigate("/create-order");
    if (role === "Manager" || role === "Admin") {
        navigate("/orders"); // Redirect to the orders page
      } else {
        navigate("/create-order"); // Redirect to the default page for other roles
      }
    } catch (error) {
      console.error(error);
      alert("Error during login: " + (error.response?.data?.error || "Something went wrong"));
    }
  };
  

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
