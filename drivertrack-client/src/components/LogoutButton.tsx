import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("driverId");

    navigate("/login", { replace: true });
  }

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;