import { useNavigate } from "react-router-dom";

type LogoutButtonProps = {
  className?: string;
  onLogout?: () => void;
};

function LogoutButton({
  className,
  onLogout,
}: LogoutButtonProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("driverId");

    onLogout?.();

    navigate("/login", { replace: true });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
    >
      Вийти
    </button>
  );
}

export default LogoutButton;