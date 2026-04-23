import React, { useEffect, useState } from "react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/orders/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        console.log("Fetched Orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Enter cancel reason (optional):");
    if (reason === null) return; // user cancelled prompt

    try {
      const res = await fetch(`http://localhost:8000/orders/${orderId}/cancel/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cancel_reason: reason }),
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      alert("Order cancelled successfully!");
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: "Cancelled", cancel_reason: reason } : o
        )
      );
    } catch (err) {
      alert("Error cancelling order");
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading your orders...</p>;
const calcOrderTotal = (items) => {
  return items.reduce((sum, item) => {
    // Example assuming item has price, quantity, discountPercent fields
    const price = parseFloat(item.price || 0);
    const quantity = item.quantity || 1;
    const discountPercent = item.discountPercent || 0; // if present

    const discountedPrice = price * (1 - discountPercent / 100);
    return sum + discountedPrice * quantity;
  }, 0);
};

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <span role="img" aria-label="box">📦</span> My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-700">No orders found.</p>
      ) : (
        orders.map((order) => {
          console.log("Order for rendering:", order);
          // Calculate final total safely:
          const total = Number(order.total ?? 0);
          const discount = Number(order.discount ?? 0);
          const originalTotal = Number(order.original_total ?? total);
          const finalTotal = calcOrderTotal(order.items);

          return (
            <div
              key={order.order_id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div className="flex items-center gap-2 text-xl font-bold text-gray-700 mb-2">
                <span><strong>Order ID:</strong></span>
                <span className="text-gray-800">{order.order_id}</span>
              </div>

              <div className="text-gray-600">
                <p>
                  <strong>Date:</strong>{" "}
                  {isNaN(Date.parse(order.date))
                    ? "Invalid date"
                    : new Date(order.date).toLocaleString()}
                </p>
                <p><strong>Payment:</strong> {order.payment_method}</p>

                {/* Show original price and discount only if discount > 0 */}
                {discount > 0 && (
                  <>
                    <p><strong>Original Price:</strong> ₹{originalTotal.toFixed(2)}</p>
                    <p style={{ color: "green" }}>
                      <strong>Discount:</strong> -₹{discount.toFixed(2)}
                    </p>
                  </>
                )}

                <p className="mt-2 font-semibold">
                  <strong>Order Total:</strong> ₹{parseFloat(order.total).toFixed(2)}
                </p>

                <p className="mt-4 text-red-600 text-sm text-right ml-auto w-fit">
                  Return available only for 3 days from delivery
                </p>

                {order.cancel_reason && (
                  <p className="text-gray-500 text-sm mt-1">
                    <strong>Cancel Reason:</strong> {order.cancel_reason}
                  </p>
                )}

                {(order.status === "Pending" || order.status === "Ordered") && (
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrdersPage;
