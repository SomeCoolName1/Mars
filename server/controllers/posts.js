import Post from "../models/Posts.js";
import User from "../models/User.js";

//POSTS GET--------------------------------------------------------------------
export const createPost = async (req, res) => {
  try {
    let filename = "";

    const { userID, content } = req.body;

    if (req.file) {
      filename = req.file.filename;
    }

    const user = await User.findById(userID);

    const { username, profilePicture } = user;

    const newPost = new Post({
      userID: userID,
      username: username,
      userImagePath: profilePicture,
      content: content,
      imagePath: filename,
      likes: {},
      comments: [],
    });

    await newPost.save();

    // Return all posts after submitting new one
    const post = await Post.find();
    res.json(post);
  } catch (err) {
    res.json({ message: err.message });
  }
};

//For home feed, grab all recent posts
export const getPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });

    res.json(post);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log("test");

    const posts = await Post.find({
      likes: { $in: { [userID]: true } },
    });

    //641a545d5bd23b60bed239d8
    // const posts = await Post.find({ userID: { $in: friends } })

    console.log(posts);

    res.json(posts);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userID } = req.params;
    const posts = await Post.find({ userID }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const getFriendPosts = async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findById(userID);
    const { friends } = user;

    const posts = await Post.find({ userID: { $in: friends } })
      .sort({ createdAt: -1 })
      .limit(7);

    res.json(posts);
  } catch (err) {
    res.json({ message: err.message });
  }
};

//PATCH--------------------------------------------------------------------

export const likePost = async (req, res) => {
  try {
    //Post ID
    const { ID } = req.params;
    const { userID } = req.body;
    const post = await Post.findById(ID);
    const isLiked = post.likes.get(userID);

    if (isLiked) {
      post.likes.delete(userID);
    } else {
      post.likes.set(userID, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      ID,
      { likes: post.likes },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postID } = req.params;
    const { content, image } = req.body;
    let imageFile;

    if (req.file) {
      imageFile = req.file.filename;
    } else if (image == "null") {
      imageFile = "";
    } else imageFile = false;

    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      {
        content: content,
        ...(imageFile !== false && {
          imagePath: imageFile,
        }),
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    //Post ID
    const { ID } = req.params;

    const post = await Post.findByIdAndDelete(ID);

    res.json(post);
  } catch (err) {
    res.json({ message: err.message });
  }
};

//COMMENTS--------------------------------------------------------------------

export const createComment = async (req, res) => {
  try {
    const { content, userID } = req.body;
    const { postID } = req.params;

    const post = await Post.findById(postID);

    const newComment = {
      userID: userID,
      content: content,
    };

    post.comments.push(newComment);

    await post.save();
    res.json({ post });
  } catch (err) {
    res.json({ message: err.message });
  }
};
