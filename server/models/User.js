import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      min: 1,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Fucking provide a password!"],
      min: 1,
      max: 50,
    },
    username: {
      type: String,
      max: 20,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bannerPicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "Welcome to my profile",
    },
    friends: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
