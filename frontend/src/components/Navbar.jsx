import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useIsMobile from "../utils/useIsMobile";
import { useTheme } from "../context/ThemeContext";

const megaMenuData = {
  men: {
    "NEW DROPS": ["Latest Arrivals", "Limited Editions", "Trending"],
    "SNEAKERS": ["Lifestyle", "Running", "Basketball", "Football", "Tennis", "Training", "Skateboarding"],
    "PREMIUM": ["Jordan", "Nike Air", "Adidas Originals", "Puma Select", "New Balance"],
    "SHOP BY PRICE": ["Under \u20b93000", "\u20b93000 - \u20b97000", "\u20b97000+"],
  },
  women: {
    "NEW DROPS": ["Latest Arrivals", "Trending"],
    "SNEAKERS": ["Lifestyle", "Running", "Training", "Tennis", "Walking"],
    "PREMIUM": ["Nike Women", "Adidas Women", "Puma Women"],
    "SHOP BY PRICE": ["Under \u20b93000", "\u20b93000 - \u20b97000", "\u20b97000+"],
  },
  kids: {
    "BOYS": ["Running", "Basketball", "Lifestyle", "School"],
    "GIRLS": ["Running", "Lifestyle", "Training", "School"],
    "FEATURED": ["New Arrivals", "Best Sellers", "School Collection"],
  },
  sale: {
    "MEN SALE": ["Running", "Lifestyle", "Basketball"],
    "WOMEN SALE": ["Running", "Lifestyle"],
    "KIDS SALE": ["School", "Lifestyle"],
    "LAST CHANCE": ["Under \u20b91999", "Under \u20b92999", "Clearance"],
  },
};

function MegaMenu({ data, visible, dark }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "1000px",
        background: dark ? "#18181b" : "#fff",
        borderTop: dark ? "1px solid #2a2a2e" : "1px solid #e5e5e5",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        padding: "40px 60px",
        display: "grid",
        gridTemplateColumns: `repeat(${Object.keys(data).length}, 1fr)`,
        gap: "50px",
        zIndex: 999,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transition: "opacity 0.18s ease",
      }}
    >
      {Object.entries(data).map(([category, items]) => (
        <div key={category}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: dark ? "#f4f4f5" : "#111",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {category}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((item) => (
              <li key={item} style={{ marginBottom: "8px" }}>
                <Link
                  to={`/products?category=${encodeURIComponent(item.toLowerCase())}`}
                  style={{ fontSize: "14px", color: dark ? "#9a9aa2" : "#555", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.target.style.color = dark ? "#fff" : "#111")}
                  onMouseLeave={(e) => (e.target.style.color = dark ? "#9a9aa2" : "#555")}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Navbar() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const role = localStorage.getItem("role");

  // THEME — dark na light na
  const themeCtx = useTheme() || {};
  const dark = themeCtx.resolvedTheme === "dark";

  // theme batti navbar colors
  const navBg = dark ? "#18181b" : "#fff";
  const navText = dark ? "#f4f4f5" : "#111";
  const navMuted = dark ? "#9a9aa2" : "#444";
  const navBorder = dark ? "#2a2a2e" : "#eee";

  useEffect(() => {
    const token = localStorage.getItem("access");
    const username = localStorage.getItem("username");
    const mail = localStorage.getItem("email");
    setUser(token ? username || "User" : null);
    setEmail(token ? mail : null);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setEmail(null);
    navigate("/login");
  };

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";

  const navLinkStyle = (paths) => {
    const isActive = Array.isArray(paths)
      ? paths.includes(location.pathname)
      : location.pathname === paths;
    return {
      fontSize: "13px",
      fontWeight: "600",
      color: isActive ? navText : navMuted,
      textDecoration: "none",
      letterSpacing: "0.02em",
      padding: "4px 0",
      borderBottom: isActive ? `2px solid ${navText}` : "2px solid transparent",
      transition: "color 0.15s, border-color 0.15s",
    };
  };

  const megaItems = [
    { key: "men", label: "Men", path: "/products?category=men" },
    { key: "women", label: "Women", path: "/products?category=women" },
    { key: "kids", label: "Kids", path: "/products?category=kids" },
    { key: "sale", label: "Sale", path: "/products?sale=true" },
  ];

  const mobileLink = {
    fontSize: "16px",
    fontWeight: "600",
    color: navText,
    textDecoration: "none",
    padding: "14px 0",
    borderBottom: `1px solid ${navBorder}`,
    display: "block",
  };

  return (
    <>
      {/* TOP BANNER */}
      {!isLoginPage && (
        <div
          style={{
            background: "#111",
            color: "#fff",
            textAlign: "center",
            padding: "8px",
            fontSize: "12px",
            fontWeight: "600",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1001,
          }}
        >
          \ud83d\udd25 UP TO 40% OFF ON PREMIUM SNEAKERS
        </div>
      )}

      <nav
        onMouseLeave={() => setActiveMenu(null)}
        style={{
          position: "fixed",
          top: isLoginPage ? 0 : 34,
          left: 0,
          right: 0,
          height: "60px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "0 20px" : "0 40px",
          background: navBg,
          borderBottom: `1px solid ${navBorder}`,
          boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.18)" : "none",
          transition: "background .3s ease, border-color .3s ease",
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "28px",
            letterSpacing: "3px",
            color: navText,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          SOLEMATE
        </Link>

        {/* ===================== DESKTOP ===================== */}
        {!isMobile && !isLoginPage && (
          <div style={{ display: "flex", gap: "28px", alignItems: "center", height: "100%", position: "relative" }}>
            <Link to="/" style={navLinkStyle("/")} onMouseEnter={() => setActiveMenu(null)}>
              Home
            </Link>
            <Link to="/products" style={navLinkStyle("/products")} onMouseEnter={() => setActiveMenu(null)}>
              Products
            </Link>
            {megaItems.map(({ key, label, path }) => (
              <div
                key={key}
                style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}
                onMouseEnter={() => setActiveMenu(key)}
              >
                <Link
                  to={path}
                  style={{
                    ...navLinkStyle("/products"),
                    color: activeMenu === key ? navText : navMuted,
                    borderBottom: activeMenu === key ? `2px solid ${navText}` : "2px solid transparent",
                  }}
                >
                  {label}
                </Link>
                <MegaMenu data={megaMenuData[key]} visible={activeMenu === key} dark={dark} />
              </div>
            ))}
          </div>
        )}

        {/* DESKTOP RIGHT SIDE */}
        {!isMobile && !isLoginPage && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* settings gear */}
            <Link to="/settings" aria-label="Settings" style={{ ...navLinkStyle("/settings"), fontSize: "18px" }}>⚙</Link>
            {user ? (
              <>
                <Link to="/cart" style={navLinkStyle("/cart")}>Cart</Link>
                <Link to="/wishlist" style={navLinkStyle("/wishlist")}>Wishlist</Link>
                <Link to="/orders" style={navLinkStyle("/orders")}>Orders</Link>
                {role === "seller" && (
                  <Link to="/seller" style={navLinkStyle("/seller")}>Seller</Link>
                )}
                {/* USER NAME + EMAIL */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.1 }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: navText }}>{user}</span>
                  {email && <span style={{ fontSize: "11px", color: navMuted }}>{email}</span>}
                </div>
                <button
                  onClick={logout}
                  style={{ background: dark ? "#e8ff3b" : "#111", color: dark ? "#1a1a1a" : "#fff", border: "none", padding: "9px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={navLinkStyle("/login")}>Login</Link>
                <Link
                  to="/register"
                  style={{ background: "#111", color: "#e8ff3b", padding: "9px 18px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "13px" }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        {/* ===================== MOBILE HAMBURGER ===================== */}
        {isMobile && !isLoginPage && (
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <span style={{ width: "24px", height: "2px", background: navText, transition: "0.2s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ width: "24px", height: "2px", background: navText, transition: "0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: "24px", height: "2px", background: navText, transition: "0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        )}
      </nav>

      {/* ===================== MOBILE DROPDOWN PANEL ===================== */}
      {isMobile && !isLoginPage && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 94,
            left: 0,
            right: 0,
            bottom: 0,
            background: navBg,
            zIndex: 999,
            padding: "20px 24px",
            overflowY: "auto",
          }}
        >
          <Link to="/" style={mobileLink}>Home</Link>
          <Link to="/products" style={mobileLink}>Products</Link>
          {megaItems.map(({ key, label, path }) => (
            <Link key={key} to={path} style={mobileLink}>{label}</Link>
          ))}

          <div style={{ height: "16px" }} />

          {user ? (
            <>
              <Link to="/cart" style={mobileLink}>Cart</Link>
              <Link to="/wishlist" style={mobileLink}>Wishlist</Link>
              <Link to="/orders" style={mobileLink}>Orders</Link>
              <Link to="/settings" style={mobileLink}>⚙ Settings</Link>
              {role === "seller" && (
                <Link to="/seller" style={mobileLink}>Seller</Link>
              )}
              <div style={{ padding: "14px 0", borderBottom: `1px solid ${navBorder}` }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: navText }}>{user}</div>
                {email && <div style={{ fontSize: "12px", color: navMuted, marginTop: "2px" }}>{email}</div>}
              </div>
              <button
                onClick={logout}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  background: dark ? "#e8ff3b" : "#111",
                  color: dark ? "#1a1a1a" : "#fff",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/settings" style={mobileLink}>⚙ Settings</Link>
              <Link to="/login" style={mobileLink}>Login</Link>
              <Link
                to="/register"
                style={{
                  marginTop: "20px",
                  display: "block",
                  textAlign: "center",
                  background: "#111",
                  color: "#e8ff3b",
                  padding: "14px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;