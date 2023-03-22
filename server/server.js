import express from "express";
import mongoose from "mongoose";
import multer from "multer";
// import bodyParser from "body-parser";
import cors from "cors"; //middleware that just passes. Sets corrects headers for response to communicate cross origin.
import dotenv from "dotenv";
import path from "path";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import { createPost, updatePost } from "./controllers/posts.js";
import { updateUser } from "./controllers/user.js";
import { verifyToken } from "./middleware/auth.js";

const app = express();
dotenv.config();

//Mongoose
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedtopology: true,
  })
  .then(console.log("mongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json());

// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//Bodyparser
//urlencoded = method inbuilt in express to recognise incoming Request Object as
//strings/arrays. Can only parse Incoming Request Object if strings/array.
//When false, can not post "nested object"
app.use(express.urlencoded({ extended: false }));

//Multer to store iamges
//https://youtu.be/wIOpe8S2Mk8

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
});

app.patch(
  "/user/:userID",
  verifyToken,
  upload.fields([
    {
      name: "profileImage",
    },
    { name: "profileBanner" },
  ]),
  updateUser
);

app.post("/posts", verifyToken, upload.single("image"), createPost);
app.patch("/posts/:postID", verifyToken, upload.single("image"), updatePost);

//Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT);
