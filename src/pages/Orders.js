import React, { useEffect, useState } from "react";
import axios from "axios";
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [filterToday, setFilterToday] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    const fetchOrders = () => {
      let url = "http://localhost:8000/api/orders";
      const params = {};

      if (filterToday) {
        params.today = true;
      }

      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      } else if (startDate) {
        params.start_date = startDate;
      }

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        })
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    };

    fetchOrders();

    axios
      .get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [token, filterToday, startDate, endDate]);

  const updateStatus = (id, status) => {
    axios
      .patch(
        `http://localhost:8000/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const handleSearch = () => {
    // Trigger the useEffect to fetch orders with the new date range
  };

  // Check if the order can be cancelled (before 4:00 PM on the order's creation day)
  const canCancelOrder = (orderDate) => {
    const orderDateTime = new Date(orderDate);
    const currentTime = new Date();
    const cutoffTime = new Date(orderDateTime);
    cutoffTime.setHours(10, 0, 0, 0); // Set cutoff time to 12 6:00 AM Ethiopia time
    return currentTime < cutoffTime;
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <button onClick={() => setFilterToday(!filterToday)} className="filter">
        {filterToday ? "Show All Orders" : "Show Today's Orders"}
      </button>
      <div className="date-range-search">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Menu Item</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th> {/* Now visible for users too */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
                <tr
                key={order.id}
                className={
                  order.status === "completed"
                    ? "completed-order"
                    : order.status === "cancelled"
                    ? "cancelled-order"
                    : ""
                }
              >
                <td>{order.id}</td>
                <td>{order.user?.email || "Unknown User"}</td>
                <td>{order.menu?.title || "Unknown Menu Item"}</td>
                <td>{order.quantity}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{order.status}</td>
                <td>
               {/* ✅ Users can cancel their OWN orders */}
{(user?.id === order.user_id || user?.role === "admin") && (
  <button
    onClick={() => updateStatus(order.id, 'cancelled')}
    disabled={
      order.status === 'cancelled' || !canCancelOrder(order.created_at)
    }
  >
    Cancel Order
  </button>
)}
                  
                  {/* ✅ Admins can mark orders as completed */}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      disabled={order.status === 'completed'}
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
