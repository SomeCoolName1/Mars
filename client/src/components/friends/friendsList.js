import "./friendsList.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setFriends } from "../../state/userSlice";
import Friend from "./friend";

const Friends = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const { _id, friends } = user;

  const getFriends = async () => {
    const response = await fetch(`http://localhost:5000/users/${_id}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    dispatch(setFriends({ friends: data }));
  };

  const getFriendSuggestion = async () => {
    const response = await fetch(
      `http://localhost:5000/users/${_id}/friends/suggestions`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    setSuggestions(data);
  };

  //Thinks dependency

  useEffect(() => {
    getFriends();
    setSearch("");
    getFriendSuggestion();
  }, [posts, friends.length]);

  useEffect(() => {
    setSearch("");
  }, []);

  return (
    <div className="friends-container">
      <div className="friends-list">
        <header className="friends-header">
          <h1 className="friends-title">Friends</h1>
        </header>
        <input
          className="friend-search-bar"
          type="text"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          name="friend"
          placeholder="Search for friend"
          value={search}
        />
        {friends ? (
          <>
            {friends
              .filter(
                (user) =>
                  user.username && user.username.toLowerCase().includes(search)
              )
              .map((filtered) => {
                return (
                  <Friend
                    friendID={filtered._id}
                    username={filtered.username}
                    profilePicture={filtered.profilePicture}
                    bio={filtered.bio}
                  />
                );
              })}
          </>
        ) : (
          <div className="lonely-div">Go make some friends</div>
        )}
      </div>
      <div className="suggestions-list">
        <h1>Suggested Friends</h1>
        <>
          {suggestions && suggestions.length !== 0 ? (
            <>
              {suggestions.map((friend) => (
                <Friend
                  friendID={friend._id}
                  username={friend.username}
                  profilePicture={friend.profilePicture}
                  bio={friend.bio}
                />
              ))}
            </>
          ) : (
            <div className="lonely-div">No suggested friends</div>
          )}
        </>
        <div className="suggestions-footer">
          <p>More</p>
        </div>
      </div>
    </div>
  );
};

export default Friends;
