import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CommentsRender = ({ userID, content }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const token = useSelector((state) => state.token);

  const getUser = async () => {
    const response = await fetch(`http://localhost:5000/users/${userID}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    console.log(data);
    setUser(data);
  };

  const navigateToProfile = (userID) => {
    navigate(`/user/${userID}`);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="user-comments-container">
      <img
        src={user ? `http://localhost:5000/assets/${user.profilePicture}` : ""}
        onClick={() => navigateToProfile(user.userID)}
        alt="author"
        className="user-comments-author-image"
      />
      <div className="user-comments-content">
        <div
          className="user-comments-author"
          onClick={() => navigateToProfile(userID)}
        >
          {user ? user.username : ""}
        </div>
        <div className="user-comment">{content}</div>
      </div>
    </div>
  );
};

export default CommentsRender;
