import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", formData);
      alert("Registration successful!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error during registration");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <select name="role" value={formData.role} onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
        <option value="Employee">Employee</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
