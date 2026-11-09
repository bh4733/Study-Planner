import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../services/api";
import FormField from "../components/forms/formfield";
import Alert from "../components/ui/alert";

// These rules match the server's. The client checks for instant feedback;
// the server checks because client-side code can be bypassed.
const validate = ({ username, password, confirmPassword }) => {
  const errors = {};
  if (!/^[A-Za-z0-9_.-]{3,30}$/.test(username.trim())) {
    errors.username = "Use 3–30 letters, numbers, dots, dashes or underscores.";
  }
  if (password.length < 8 || password.length > 72) {
    errors.password = "Password must be 8–72 characters.";
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords don't match.";
  }
  return errors;
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // clear that field's error as the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const username = form.username.trim();
      await registerUser({ username, password: form.password });
      navigate("/login", { replace: true, state: { registered: true, username } });
    } catch (err) {
      if (err.details) setErrors(err.details); // server field errors
      else if (err.status === 409) setErrors({ username: err.message }); // username taken
      else setFormError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Create an account</h1>
      <p className="muted">Keep track of every deadline in one place.</p>

      <Alert>{formError}</Alert>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
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
          error={errors.password}
          hint="At least 8 characters."
          autoComplete="new-password"
          required
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />
        <button type="submit" className="button button-block" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
