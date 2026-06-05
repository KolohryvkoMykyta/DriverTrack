import { useState } from "react";

import { login } from "../api/authApi";
import { getApiErrorMessage } from "../api/apiErrorHandler";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await login({
        email,
        password,
      });

      setErrorMessage("");

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);

      if (response.driverId) {
        localStorage.setItem("driverId", response.driverId);
      } else {
        localStorage.removeItem("driverId");
      }

      if (response.role === "Admin") {
        window.location.replace("/admin");
      } else if (response.role === "Driver") {
        window.location.replace("/driver");
}
    } catch (error: any) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            autoComplete="username"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {errorMessage && (
          <div
            style={{
              color: "red",
              marginTop: "10px",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;