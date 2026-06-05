import { useEffect, useState } from "react";
import { getCurrentUser, type CurrentUser } from "../api/authApi";
import LogoutButton from "../components/LogoutButton";

function DriverDashboardPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      setCurrentUser(user);
    }

    loadCurrentUser();
  }, []);

  return (
    <div>
      <h1>Driver Dashboard</h1>

      <LogoutButton />

      <p>Welcome, {currentUser?.displayName}</p>
    </div>
  );
}

export default DriverDashboardPage;