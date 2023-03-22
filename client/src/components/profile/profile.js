import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setFriends } from "../../state/userSlice";
import ProfileDetails from "./profileDetails";
import GetPost from "../posts/getPosts";
import "./profile.scss";
import ProfileFriends from "./profileFriends";

const Profile = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);
  const [displayForm, setDisplayForm] = useState("none");
  const [category, setCategory] = useState("Posts");

  const { _id, friends } = loggedUser; //Logged in user
  const { userID } = useParams(); //Profile of viewed user

  const getUser = async () => {
    const response = await fetch(`http://localhost:5000/users/${userID}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setUser(data);
  };

  const isFriend = friends.find((friend) => friend._id === userID);

  useEffect(() => {
    getUser();
    setCategory("Posts");
  }, [userID]);

  if (!user) return null;

  const updateFriend = async () => {
    const response = await fetch(
      `http://localhost:5000/users/${userID}/friends`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ loggedUser: _id }),
      }
    );

    const data = await response.json();

    dispatch(setFriends({ friends: data }));
  };

  const toggleFormDisplay = () => {
    if (displayForm === "none") {
      setDisplayForm("show");
    } else {
      setDisplayForm("none");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-banner-container">
            <img
              className="profile-banner"
              src={`http://localhost:5000/assets/${user.bannerPicture}`}
              alt="banner"
            />
          </div>
          <div className="profile-picture-container">
            <div className="profile-picture">
              <img
                className="profile-picture-image"
                src={`http://localhost:5000/assets/${user.profilePicture}`}
                alt="profile"
              />
            </div>
            {loggedUser && _id === userID ? (
              <button onClick={toggleFormDisplay}>Edit Profile</button>
            ) : isFriend ? (
              <button onClick={updateFriend}>Remove Friend</button>
            ) : (
              <button onClick={updateFriend}>Add Friend</button>
            )}
          </div>
          <div className="profile-name">{user.username}</div>
          <div className="profile-bio">{user.bio}</div>
        </div>
        <div className="profile-category">
          <button
            onClick={() => setCategory("Posts")}
            className={category === "Posts" ? "category-active" : ""}
          >
            <h1>Posts</h1>
          </button>
          <button
            onClick={() => setCategory("Friends")}
            className={category === "Friends" ? "category-active" : ""}
          >
            <h1>Friends</h1>
          </button>
          <button
            onClick={() => setCategory("Likes")}
            className={category === "Likes" ? "category-active" : ""}
          >
            <h1>Likes</h1>
          </button>
        </div>
      </div>
      {category === "Posts" ? (
        <GetPost userID={userID} state="Profile" />
      ) : category === "Likes" ? (
        <GetPost userID={userID} state="Likes" />
      ) : category === "Friends" ? (
        <ProfileFriends userID={userID} />
      ) : (
        <></>
      )}

      {displayForm === "show" ? (
        <ProfileDetails
          display={displayForm}
          setDisplay={setDisplayForm}
          userInfo={user}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Profile;

// {
//   _id: "63e3718ef08f3b23b4a40e75",
//   userID: "63e37171f08f3b23b4a40e71",
//   username: "somecooiname",
//   content: "1234567890",
//   imagePath: "",
//   likes: {},
//   comments: [],
// },
