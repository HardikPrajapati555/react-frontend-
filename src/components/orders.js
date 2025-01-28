import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyAverageSales, setDailyAverageSales] = useState({});
  const [employeePerformance, setEmployeePerformance] = useState({});
  const [sortConfig] = useState({ key: "totalOrders", direction: "asc" });
  const [performanceFilter, setPerformanceFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get("https://backend-api-a4xs.onrender.com/api/orders", config);
        setOrders(response.data);

        const dailySales = {};
        const employeeSales = {};

        response.data.forEach((order) => {
          const orderDate = new Date(order.createdAt).toLocaleDateString();
          dailySales[orderDate] = dailySales[orderDate] ? dailySales[orderDate] + order.totalCost : order.totalCost;

          if (order.employee) {
            if (!employeeSales[order.employee.name]) {
              employeeSales[order.employee.name] = { totalSales: 0, totalOrders: 0 };
            }
            employeeSales[order.employee.name].totalSales += order.totalCost;
            employeeSales[order.employee.name].totalOrders += 1;
          }
        });

        const avgDailySales = Object.keys(dailySales).reduce((acc, date) => {
          acc[date] = dailySales[date] / response.data.filter(order => new Date(order.createdAt).toLocaleDateString() === date).length;
          return acc;
        }, {});

        const performanceRatings = Object.keys(employeeSales).reduce((acc, employee) => {
          const { totalSales, totalOrders } = employeeSales[employee];
          let rating = "Bad";
          if (totalOrders > 20 || totalSales > 2000) {
            rating = "Very Good";
          } else if (totalOrders >= 10 || totalSales >= 1000) {
            rating = "Good";
          } else if (totalOrders >= 5 || totalSales >= 500) {
            rating = "Average";
          }
          acc[employee] = { totalSales, totalOrders, rating };
          return acc;
        }, {});

        setDailyAverageSales(avgDailySales);
        setEmployeePerformance(performanceRatings);

      } catch (err) {
        console.error("Error fetching orders:", err.response || err.message);
        alert("Failed to fetch orders: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  const handleFilterChange = (event) => {
    setPerformanceFilter(event.target.value);
  };

  const sortedPerformanceData = [...Object.entries(employeePerformance)].sort((a, b) => {
    const aValue = a[1][sortConfig.key];
    const bValue = b[1][sortConfig.key];
    if (sortConfig.direction === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const filteredPerformanceData = performanceFilter === "All" ? sortedPerformanceData : sortedPerformanceData.filter(([employee, stats]) => stats.rating === performanceFilter);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">All Orders</h1>
      
      <h2 className="text-xl font-medium text-gray-800 mb-4">Daily Average Sales</h2>
      <table className="w-full table-auto border-collapse mb-6">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-4">Date</th>
            <th className="p-4">Average Sale</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dailyAverageSales).map(([date, avgSale]) => (
            <tr key={date} className="hover:bg-gray-200">
              <td className="p-4">{date}</td>
              <td className="p-4">{avgSale.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-6">
        <label className="mr-4">Filter by Performance: </label>
        <select className="p-2 border border-gray-300 rounded-md" value={performanceFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Bad">Bad</option>
          <option value="Average">Average</option>
          <option value="Good">Good</option>
          <option value="Very Good">Very Good</option>
        </select>
      </div>

      <h2 className="text-xl font-medium text-gray-800 mb-4">Employee Performance</h2>
      <table className="w-full table-auto border-collapse mb-6">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-4">Employee Name</th>
            <th className="p-4">Total Orders</th>
            <th className="p-4">Total Sales</th>
            <th className="p-4">Performance</th>
          </tr>
        </thead>
        <tbody>
          {filteredPerformanceData.length === 0 ? (
            <tr className="empty">
              <td colSpan="4">No employees found with the selected performance rating.</td>
            </tr>
          ) : (
            filteredPerformanceData.map(([employeeName, stats]) => (
              <tr key={employeeName} className="hover:bg-gray-200">
                <td className="p-4">{employeeName}</td>
                <td className="p-4">{stats.totalOrders}</td>
                <td className="p-4">{stats.totalSales.toFixed(2)}</td>
                <td className="p-4">{stats.rating}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 className="text-xl font-medium text-gray-800 mb-4">Order List</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-4">Customer Name</th>
            <th className="p-4">Cloth</th>
            <th className="p-4">Quantity</th>
            <th className="p-4">Total Cost</th>
            <th className="p-4">Employee</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr className="empty">
              <td colSpan="6">No orders found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-200">
                <td className="p-4">{order.customerName}</td>
                <td className="p-4">{order.cloth}</td>
                <td className="p-4">{order.quantity}</td>
                <td className="p-4">${order.totalCost}</td>
                <td className="p-4">{order.employee ? order.employee.name : "N/A"}</td>
                <td className="p-4"><button className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;



