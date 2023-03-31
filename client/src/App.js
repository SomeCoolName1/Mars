import "./App.scss";
import WithNav from "./withNav";
import Home from "./components/home";
import Login from "./components/loginPage/login";
import Register from "./components/loginPage/register";
import Profile from "./components/profile/profile";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { reset } from "./state/userSlice";

function App() {
  const dispatch = useDispatch();
  dispatch(reset());

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route element={<WithNav />}>
          <Route exact path="/home" element={<Home />} />
          <Route path="/user/:userID" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
