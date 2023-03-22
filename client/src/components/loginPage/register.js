import { useState } from "react";
import "./loginPage.scss";
import { useNavigate } from "react-router-dom";

const Register = () => {
  let url = "http://localhost:5000/auth/register";
  let navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    });

    const data = await response.json();

    if (data.status === "ok") {
      navigate("/");
    }
  };

  const returnToLogin = () => {
    navigate("/");
  };

  return (
    <div className="register-container user-cred-container">
      <form
        className="register-form user-cred-form"
        onSubmit={handleRegistration}
        autocomplete="off"
      >
        <div className="register-form-header">
          <button className="return-button" onClick={returnToLogin}>
            ←
          </button>
          <h1>Registration to 火星</h1>
        </div>
        <div className="input-container">
          <input
            onChange={handleChange}
            type="email"
            name="email"
            autocomplete="nope"
            required
          />
          <label for="email" className="input-label">
            Email
          </label>
        </div>
        <div className="input-container">
          <input
            onChange={handleChange}
            type="username"
            name="username"
            required
          />
          <label for="username" className="input-label">
            Username
          </label>
        </div>
        <div className="input-container">
          <input
            onChange={handleChange}
            type="password"
            name="password"
            required
          />{" "}
          <label for="password" className="input-label">
            Password
          </label>
        </div>
        <div className="input-container">
          <input
            onChange={handleChange}
            type="password"
            name="confirmPassword"
            required
          />
          <label for="confirmPassword" className="input-label">
            Confirm Password
          </label>
        </div>
        <button className="form-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
