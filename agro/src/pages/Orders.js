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

  // ✅ cancel order
  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Enter cancel reason (optional):");
    if (reason === null) return;

    try {
      const res = await fetch(
        `http://localhost:8000/orders/${orderId}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ cancel_reason: reason }),
        }
      );

      if (!res.ok) throw new Error("Failed to cancel order");

      alert("Order cancelled successfully!");

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId
            ? { ...o, status: "Cancelled", cancel_reason: reason }
            : o
        )
      );
    } catch (err) {
      alert("Error cancelling order");
      console.error(err);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading your orders...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        📦 My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-700">No orders found.</p>
      ) : (
        orders.map((order) => {
          const total = Number(order.total) || 0;
          const discount = Number(order.discount) || 0;
          const originalTotal = Number(order.original_total) || total;

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
              {/* ORDER ID */}
              <div className="text-xl font-bold mb-2">
                Order ID: {order.order_id}
              </div>

              {/* ORDER INFO */}
              <div className="text-gray-600">
                <p>
                  <strong>Date:</strong>{" "}
                  {order.date
                    ? new Date(order.date).toLocaleString()
                    : "Invalid date"}
                </p>

                <p>
                  <strong>Payment:</strong> {order.payment_method}
                </p>

                {/* ORIGINAL + DISCOUNT */}
                {discount > 0 && (
                  <>
                    <p>
                      <strong>Original Price:</strong> ₹
                      {originalTotal.toFixed(2)}
                    </p>
                    <p style={{ color: "green" }}>
                      <strong>Discount:</strong> -₹{discount.toFixed(2)}
                    </p>
                  </>
                )}

                {/* FINAL TOTAL (SAFE) */}
                <p className="mt-2 font-semibold">
                  <strong>Order Total:</strong> ₹{total.toFixed(2)}
                </p>

                {/* STATUS */}
                <p className="mt-2">
                  <strong>Status:</strong> {order.status}
                </p>

                {/* RETURN NOTE */}
                <p className="mt-4 text-red-600 text-sm">
                  Return available only for 3 days from delivery
                </p>

                {/* CANCEL REASON */}
                {order.cancel_reason && (
                  <p className="text-gray-500 text-sm mt-1">
                    <strong>Cancel Reason:</strong> {order.cancel_reason}
                  </p>
                )}

                {/* CANCEL BUTTON */}
                {(order.status === "Pending" ||
                  order.status === "Ordered") && (
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3"
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