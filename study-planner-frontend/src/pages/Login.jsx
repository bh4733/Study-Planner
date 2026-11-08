import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    const res = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    console.log("login response:", data);

    login(data.token);

    console.log("✅ calling navigate...");
    navigate("/dashboard");
  };

  return (
    <div>
      <input
        placeholder="username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={submit}>Login</button>

      <p>
        Don’t have an account?
        <button onClick={() => navigate("/register")}>Register</button>
      </p>
    </div>
  );
};

export default Login;
