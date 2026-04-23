import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Nav from "./components/nav";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Advantages from "./pages/Advantages";
import Services from "./pages/Services";
import Schemes from "./pages/Schemes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryRow from "./pages/Shopping";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import Summary from "./pages/Summary";
import OrderPlacedPage from "./pages/OrderPlaced";
import OrderDetailsPage from "./pages/OrderDetails";
import OrdersPage from "./pages/Orders";
import ProductList from "./components/new";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import SearchResults from "./components/SearchResults";

import { CartProvider } from "./pages/cartContext"; // ✅ Import your CartProvider

// Inner App that can access `useLocation`
function InnerApp() {
  const location = useLocation();
  const showEcomNav = [
    "/shopping", "/cart", "/address", "/payment",
    "/summary", "/placed", "/details", "/orders", "/product", "/search"
  ].some((path) => location.pathname.startsWith(path));

  return (
    <>
      <Navbar />
      {showEcomNav && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/advantages" element={<Advantages />} />
        <Route path="/services" element={<Services />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shopping" element={<CategoryRow />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<Address />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/placed" element={<OrderPlacedPage />} />
        <Route path="/details" element={<OrderDetailsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/new" element={<ProductList />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </>
  );
}

// Top-level App with Router + CartProvider
export default function App() {
  return (
    <CartProvider>
      <Router>
        <InnerApp />
      </Router>
    </CartProvider>
  );
}
