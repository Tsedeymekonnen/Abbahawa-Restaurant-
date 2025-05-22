import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [filterToday, setFilterToday] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = localStorage.getItem("token");

  // Format date with day name
  const formatDateWithDay = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    return `${dayName}, ${date.toLocaleString()}`;
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Fetch user first, then fetch orders depending on role
    axios.get("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
      setUser(response.data);
      
      // After user is set, fetch orders
      fetchOrders(response.data);
    }).catch(error => {
      console.error("Error fetching user:", error);
    });
  }, [token, filterToday, startDate, endDate]);

  const fetchOrders = (currentUser) => {
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

    // If normal user, filter orders by their user id (backend should support this)
    if (currentUser?.role !== "admin" && currentUser?.role !== "superadmin") {
      params.user_id = currentUser.id;
    }

    axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }).then(response => {
      setOrders(response.data);
    }).catch(error => {
      console.error("Error fetching orders:", error);
    });
  };

  const updateStatus = (id, status) => {
    axios.patch(
      `http://localhost:8000/api/orders/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setOrders(orders.map(order => (order.id === id ? { ...order, status } : order)));
    }).catch(error => {
      console.error("Error updating status:", error);
    });
  };

  const handleSearch = () => {
    if(user) fetchOrders(user);
  };

  // Check if order can be cancelled (before 10:00 AM on order day)
  const canCancelOrder = (orderDate) => {
    const orderDateTime = new Date(orderDate);
    const currentTime = new Date();
    const cutoffTime = new Date(orderDateTime);
    cutoffTime.setHours(10, 0, 0, 0);
    return currentTime < cutoffTime;
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = orders.map(order => ({
      'Order ID': order.id,
      'User Email': order.user?.email || "Unknown User",
      'Personal Area': order.user?.personal_area || "N/A",
      'Floor': order.user?.floor || "N/A",
      'Department': order.user?.department || "N/A",
      'Menu Item': order.menu?.title || "Unknown Menu Item",
      'Category': order.menu?.category || "N/A",
      'Quantity': order.quantity,
      'Order Date': formatDateWithDay(order.created_at),
      'Status': order.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Orders Report', 14, 15);

    const headers = [
      'Order ID',
      'User Email',
      'Personal Area',
      'Floor',
      'Department',
      'Menu Item',
      'Category',
      'Quantity',
      'Order Date',
      'Status'
    ];

    const data = orders.map(order => [
      order.id,
      order.user?.email || "Unknown User",
      order.user?.personal_area || "N/A",
      order.user?.floor || "N/A",
      order.user?.department || "N/A",
      order.menu?.title || "Unknown Menu Item",
      order.menu?.category || "N/A",
      order.quantity,
      formatDateWithDay(order.created_at),
      order.status
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 25,
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
        7: { cellWidth: 15 },
        8: { cellWidth: 30 },
        9: { cellWidth: 15 }
      }
    });

    doc.save("orders.pdf");
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>

      <div className="export-buttons">
        <button onClick={exportToExcel} className="export-btn">Export to Excel</button>
        <button onClick={exportToPDF} className="export-btn">Export to PDF</button>
      </div>

      <button onClick={() => setFilterToday(!filterToday)} className="filter">
        {filterToday ? "Show All Orders" : "Show Today's Orders"}
      </button>

      <div className="date-range-search">
        <input 
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: 'auto' }} 
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: 'auto' }} 
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
              <th>Personal Area</th>
              <th>Floor</th>
              <th>Department</th>
              <th>Menu Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
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
                <td>{order.user?.personal_area || "N/A"}</td>
                <td>{order.user?.floor || "N/A"}</td>
                <td>{order.user?.department || "N/A"}</td>
                <td>{order.menu?.title || "Unknown Menu Item"}</td>
                <td>{order.menu?.category || "N/A"}</td>
                <td>{order.quantity}</td>
                <td>{formatDateWithDay(order.created_at)}</td>
                <td>{order.status}</td>
                <td>
                  {/* Cancel button logic:
                      - Admins and super admins can cancel any order (if not already cancelled)
                      - Normal users can only cancel their own orders and only before cutoff time
                  */}
                  {((user?.role === "admin" || user?.role === "superadmin") || (user?.id === order.user_id)) && (
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      disabled={
                        order.status === 'cancelled' || 
                        (user?.role !== "admin" && user?.role !== "superadmin" && !canCancelOrder(order.created_at))
                      }
                    >
                      Cancel Order
                    </button>
                  )}

                  {/* Only admin and superadmin can mark as completed */}
                  {(user?.role === "admin" || user?.role === "superadmin") && (
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
