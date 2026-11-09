import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import FormField from "../components/forms/formfield";
import Alert from "../components/ui/alert";

export default function Login() {
  const { login, sessionMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: location.state?.username ?? "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const justRegistered = Boolean(location.state?.registered);
  const notice = justRegistered
    ? "Account created. You can log in now."
    : sessionMessage;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser reloading the page
    if (!form.username.trim() || !form.password) {
      setError("Enter your username and password.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await login(form.username.trim(), form.password);
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Log in</h1>
      <p className="muted">Welcome back to your study planner.</p>

      {!error && (
        <Alert type={justRegistered ? "success" : "info"}>{notice}</Alert>
      )}
      <Alert>{error}</Alert>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          autoFocus
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          className="button button-block"
          disabled={submitting}
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
