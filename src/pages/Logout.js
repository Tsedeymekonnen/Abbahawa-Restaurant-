import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to the sign-in page after logout
    navigate("/");
  }, [navigate]);

  return (
    <div className="logout-page">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
