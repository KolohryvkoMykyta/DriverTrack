import { useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, LoaderCircle, Truck } from "lucide-react";

import "../styles/login.css";

import { login } from "../api/authApi";
import { getApiErrorMessage } from "../api/apiErrorHandler";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setErrorMessage("");

    try {
      setIsSubmitting(true);

      const response = await login({
        email: email.trim(),
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
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <div className="login-brand">
          <span className="login-brand__icon" aria-hidden="true"><Truck size={25} /></span>
          <span>DriverTrack</span>
        </div>

        <section className="login-card" aria-labelledby="login-title">
          <header className="login-card__header">
            <h1 id="login-title">Вхід до кабінету</h1>
            <p>Увійдіть, щоб продовжити роботу з перевезеннями.</p>
          </header>

          <form className="login-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <div className="login-field">
              <label htmlFor="login-email">Електронна пошта</label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="name@example.com"
                required
                disabled={isSubmitting}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Пароль</label>
              <div className="login-password">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  placeholder="Введіть пароль"
                  required
                  disabled={isSubmitting}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  className="login-password__toggle"
                  type="button"
                  aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                  aria-controls="login-password"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="login-error" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="login-spinner" size={19} aria-hidden="true" /> : null}
              {isSubmitting ? "Входимо…" : "Увійти"}
              {!isSubmitting && <ArrowRight size={18} aria-hidden="true" />}
            </button>
          </form>

          <p className="login-card__help">Не маєте доступу? Зверніться до адміністратора.</p>
        </section>

        <p className="login-caption">Облік перевезень. Усе під контролем.</p>
      </div>
    </main>
  );
}

export default LoginPage;
