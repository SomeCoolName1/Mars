import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./profileFriends.scss";
import cardIcon from "../../assets/card-style.png";
import bannerIcon from "../../assets/list-style.webp";

const ProfileFriends = ({ userID }) => {
  const token = useSelector((state) => state.token);
  const loggedUser = useSelector((state) => state.user);
  const [friendsList, setFriendsList] = useState(null);
  const navigate = useNavigate();

  const { friends } = loggedUser;

  //banner-style card-style
  const [listStyle, setListStyle] = useState("friend-card-style");

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:5000/users/${userID}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    setFriendsList(data);
  };

  useEffect(() => {
    getFriends();
  }, [userID, friends]);

  const navigateToProfile = (userID) => {
    navigate(`/user/${userID}`);
  };

  const setStyle = (e) => {
    setListStyle(e.target.id);
  };

  return (
    <div className={`${listStyle}`}>
      <div className="profile-friends-styles">
        <button
          className="profile-set-banner list-style-button"
          onClick={(e) => setStyle(e)}
        >
          <img
            src={cardIcon}
            alt="card-style"
            id="friend-banner-style"
            className={listStyle === "friend-banner-style" ? "active" : ""}
          />
        </button>
        <button
          className="profile-set-list list-style-button"
          onClick={(e) => setStyle(e)}
        >
          <img
            src={bannerIcon}
            alt="banner-style"
            id="friend-card-style"
            className={listStyle === "friend-card-style" ? "active" : ""}
          />
        </button>
      </div>
      <div className={"profile-friends-container"}>
        {friendsList && friendsList.length !== 0 ? (
          friendsList.map((user) => {
            return (
              <div
                className="profile-friend"
                onClick={() => navigateToProfile(user._id)}
              >
                <img
                  className="profile-friend-banner"
                  src={`http://localhost:5000/assets/${user.bannerPicture}`}
                  alt="user banner"
                />
                <div className="profile-friend-details">
                  <img
                    className="profile-friend-image"
                    src={`http://localhost:5000/assets/${user.profilePicture}`}
                    alt="user profile"
                  />
                  <div className="profile-friend-name">
                    <h1>{user.username}</h1>
                    <h4>{user.bio}</h4>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            {" "}
            <p>No friends</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFriends;
