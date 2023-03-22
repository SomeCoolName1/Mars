import mongoose from "mongoose";
import Post from "../models/Posts.js";
import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.findById(userID);

    res.json(user);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const { profileImage, profileBanner } = req.files;
    const { userID } = req.params;

    //If image/banner kept same, req.files === undefined

    const updateProfile = await User.findByIdAndUpdate(
      userID,
      {
        username: username,
        bio: bio,
        ...(profileImage && { profilePicture: profileImage[0].filename }),
        ...(profileBanner && { bannerPicture: profileBanner[0].filename }),
      },
      { new: true }
    );

    //By Default, findbyidandupdate returns old model. {new:true} gives updated

    await Post.updateMany(
      { userID: userID },
      {
        username: username,
        ...(profileImage && { userImagePath: profileImage[0].filename }),
      }
    );

    res.json(updateProfile);
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.findById(userID);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const obtainFriendInfo = friends.map(
      ({ _id, username, profilePicture, bannerPicture, bio }) => {
        return { _id, username, profilePicture, bannerPicture, bio };
      }
    );

    res.json(obtainFriendInfo);
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getFriendSuggestions = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.findById(userID);
    const userFriends = user.friends;

    //Add own userID to filter out from list of users
    userFriends.push(userID);

    let userIDs = userFriends.map((s) => mongoose.Types.ObjectId(s));

    const suggestions = await User.aggregate([
      { $match: { _id: { $nin: userIDs } } },
      { $sample: { size: 2 } },
    ]);

    res.json(suggestions);
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const updateFriend = async (req, res) => {
  //req.body._id = loggedinUser
  //reg.param = id of viewed profile
  try {
    const { loggedUser } = req.body;
    const { userID } = req.params;

    const getLoggedUser = await User.findById(loggedUser);
    const getFriend = await User.findById(userID);

    if (getLoggedUser.friends.includes(userID)) {
      getLoggedUser.friends = getLoggedUser.friends.filter(
        (id) => id !== userID
      );
      getFriend.friends = getFriend.friends.filter((id) => id !== loggedUser);
    } else {
      getLoggedUser.friends.push(userID);
      getFriend.friends.push(loggedUser);
    }

    await getLoggedUser.save();
    await getFriend.save();

    const friends = await Promise.all(
      getLoggedUser.friends.map((id) => User.findById(id))
    );

    const obtainFriendInfo = friends.map(
      ({ _id, username, profilePicture, bannerPicture, bio }) => {
        return { _id, username, profilePicture, bannerPicture, bio };
      }
    );

    res.json(obtainFriendInfo);
  } catch (err) {
    res.json({ error: err.message });
  }
};
