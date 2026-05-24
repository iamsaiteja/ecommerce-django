import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      localStorage.setItem("access", access);      // "access" — App.js match
      localStorage.setItem("refresh", refresh);    // "refresh"
      navigate("/products");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h3>Logging you in...</h3>
    </div>
  );
};

export default AuthCallback;