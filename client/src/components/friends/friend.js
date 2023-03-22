import { useNavigate } from "react-router-dom";

const Friend = ({ friendID, username, profilePicture, bio }) => {
  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate(`/user/${friendID}`);
  };

  return (
    <div className="friends" onClick={navigateToProfile}>
      <img
        className="friends-image"
        src={`http://localhost:5000/assets/${profilePicture}`}
        alt="user-profile"
      />
      <div className="friend-info">
        <div className="friends-name">{username}</div>
        <div className="friends-bio">{bio}</div>
      </div>
    </div>
  );
};

export default Friend;
