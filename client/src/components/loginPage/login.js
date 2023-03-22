import "./loginPage.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reset, setLogin } from "../../state/userSlice";
import { motion } from "framer-motion";
import rocket from "../../assets/rocket.png";
import cloud from "../../assets/smoke.png";

const Login = () => {
  let url = "http://localhost:5000/auth/login";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const toRegistration = () => {
    navigate("/register");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("clicked");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    });

    const data = await response.json();

    if (data.user) {
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
      alert("login successful");
      window.location.href = "/home";
    } else {
      alert("please check email and password");
    }
  };

  //Motion Framer--------------------
  const variants = {
    hover: {
      x: [30, -5, 30],
      y: [20, -5, 20],
      transition: {
        x: { duration: 3, repeat: Infinity },
        y: { duration: 3, repeat: Infinity },
      },

      default: { ease: "linear" },
    },
    cloud: {
      x: [0, -500],
      y: [0, 500],
      transition: {
        x: { duration: 4, repeat: Infinity },
        y: { duration: 4, repeat: Infinity },
      },

      default: { ease: "linear" },
    },
    closeForm: {
      scale: [1, 0],
      transition: {
        scale: { duration: 2, repeat: Infinity },
      },
    },
    // vanish:
  };
  //playing: (duration) => ({
  //   pathLength: 1,
  //   opacity: 1,
  //   transition: {
  //     type: "tween",
  //     duration: duration, // default duration for this transition
  //     opacity: {
  //       duration: 0 // custom duration for opacity property only
  //     }
  //   },
  // })
  return (
    <div className="login-container user-cred-container">
      <div className="animated-login-container">
        {
          <motion.img
            src={rocket}
            animate={variants.hover}
            alt="rocket"
            className="logo-rocket"
          />
          /*
        <motion.img
          src={cloud}
          animate={variants.cloud}
          alt="cloud"
          className="logo-cloud"
        />
        <motion.img
          src={cloud}
          animate={variants.cloud}
          alt="cloud"
          className="logo-cloud"
        />
        <motion.img
          src={cloud}
          animate={variants.cloud}
          alt="cloud"
          className="logo-cloud"
        /> */
        }
      </div>

      <motion.form
        className="login-form user-cred-form"
        onSubmit={handleLogin}
        autocomplete="off"
        // animate={variants.closeForm}
      >
        <h1 className="login-header">
          Login to Mars <logo>火</logo>
        </h1>

        <div className="input-container">
          <input
            onChange={handleChange}
            type="email"
            name="email"
            className="input-text"
            required
          />
          <label for="email" className="input-label">
            Email
          </label>
        </div>
        <div className="input-container">
          <input
            onChange={handleChange}
            type="password"
            name="password"
            className="input-text"
            required
          />
          <label for="password" className="input-label">
            Password
          </label>
        </div>
        <button className="form-button">Launch</button>
        <button className="form-button" onClick={() => toRegistration()}>
          Register
        </button>
      </motion.form>
    </div>
  );
};

export default Login;

//https://stackoverflow.com/questions/51115640/how-to-send-form-data-from-react-to-express
