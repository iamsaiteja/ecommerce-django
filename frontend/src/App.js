import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import SellerDashboard from "./pages/SellerDashboard"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App