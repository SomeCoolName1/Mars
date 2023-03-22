import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Registration
export const register = async (req, res) => {
  try {
    let { email, username, password } = req.body.user;

    email = email.toLowerCase();

    const salt = await bcrypt.genSalt();
    const cryptPassword = await bcrypt.hash(password, salt);

    const newUser = await User({
      email: email,
      username: username,
      password: cryptPassword,
      bannerPicture: "mars.png",
      profilePicture: "defaultprofile.webp",
    });

    const savedUser = await newUser.save();

    return res.json({ status: "ok", user: savedUser });
  } catch (err) {
    return res.json({ error: err.message });
  }
};

//Login
export const login = async (req, res) => {
  try {
    let { email, password } = req.body.user;

    email = email.toLowerCase();

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ status: "error", error: "Invalid Login" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    //Valid Password
    if (checkPassword) {
      const token = jwt.sign({ id: user.id }, "secret");
      delete user.password;
      return res.json({ user, token });
    }
  } catch (err) {
    return res.json({ error: err.message });
  }
};
