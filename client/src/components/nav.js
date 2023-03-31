import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setLogout } from "../state/userSlice";
import CreatePost from "./createpost";
import imageIcon from "../assets/imageIcon.png";
import commentIcon from "../assets/commentsIcon.png";
import heartIcon from "../assets/heartIcon.png";
import redHearIcon from "../assets/redHearIcon.png";

import "./nav.scss";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [displayCreate, setDisplay] = useState("none");
  const loggedUser = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [friendActivity, setActivity] = useState(null);

  const { _id, username, profilePicture, bannerPicture } = loggedUser;

  useEffect(() => {
    getFriendPosts();
  }, [posts]);

  const displayCreatePost = () => {
    if (displayCreate === "none") {
      setDisplay("show");
    } else {
      setDisplay("none");
    }
  };

  const getFriendPosts = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${_id}/posts/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();

    setActivity(data);
  };

  const navigateToPost = (friendID) => {
    navigate(`/user/${friendID}`);
  };

  const logOut = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <div className="nav-container">
      <div className="nav-categories">
        <div className="nav-profile">
          <div className="nav-header" onClick={() => navigate(`/user/${_id}`)}>
            <img
              src={`http://localhost:5000/assets/${bannerPicture}`}
              className="nav-profile-bg"
              alt="nav-banner"
            />
            <img
              src={`http://localhost:5000/assets/${profilePicture}`}
              className="nav-profile-image"
              alt="nav-profile"
            />
            <h1 className="nav-profile-name">{username}</h1>
          </div>
          <button onClick={() => navigate("/Home")}>Home</button>

          <button onClick={() => displayCreatePost()}>Create Article</button>
        </div>
        <div className="nav-friend-activity">
          <h1>Recent Friend Posts</h1>

          {friendActivity ? (
            friendActivity.map((post) => {
              return (
                <div
                  className="nav-recent-post"
                  onClick={() => navigateToPost(post.userID)}
                >
                  <div className="nav-recent-header">
                    {post.username} posted:
                  </div>
                  <div className="nav-recent-content">
                    <div className="nav-recent-post-content">
                      {post.content}
                    </div>
                    <div className="nav-recent-info">
                      <>
                        {post.imagePath ? (
                          <img src={imageIcon} alt="post" />
                        ) : (
                          ""
                        )}
                      </>
                      <div className="recent-post-likes">
                        {Object.keys(post.likes).includes(_id) ? (
                          <img
                            src={redHearIcon}
                            alt="likes"
                            className="red-heart"
                          />
                        ) : (
                          <img src={heartIcon} alt="likes" />
                        )}

                        {Object.keys(post.likes).length}
                      </div>
                      <div className="recent-post-comments">
                        <img src={commentIcon} alt="comments" />
                        {post.comments.length}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <p>No recent activity</p>
              <p> Maybe make some better friends.</p>
            </>
          )}
        </div>
      </div>
      <button className="nav-logout-btn" onClick={() => logOut()}>
        logout
      </button>
      {displayCreate === "show" ? (
        <div className="create-form-container">
          <CreatePost
            display={displayCreate}
            setDisplay={setDisplay}
            postData={""}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NavBar;
