import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userImagePath: String,
    content: String,
    imagePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
