import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../state/userSlice";
import "./profileDetails.scss";
import transparent from "../../assets/transparent.png";
import { useNavigate } from "react-router-dom";

const ProfileDetails = ({ setDisplay, userInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfile] = useState(null);
  const [profileImageURL, setProfileURL] = useState(null);
  const [bannerImage, setBanner] = useState(null);
  const [bannerImageURL, setBannerURL] = useState(null);

  //Set up transparent image
  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  const transparentBlob = dataURItoBlob(transparent);

  const setDefaultImage = (banner, profile) => {
    if (!banner || banner === "blob") {
      setBanner(transparentBlob);
      setBannerURL(URL.createObjectURL(transparentBlob));
    } else {
      setBanner(banner);
    }

    if (!profile || profile === "blob") {
      setProfile(transparentBlob);
      setProfileURL(URL.createObjectURL(transparentBlob));
    } else {
      setProfile(profile);
    }
  };

  useEffect(() => {
    const { username, bio, bannerPicture, profilePicture } = userInfo;
    setUsername(username);
    setBio(bio);
    setDefaultImage(bannerPicture, profilePicture);
  }, []);

  const submitChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);

    if (bannerImage) {
      formData.append("profileBanner", bannerImage);
    }
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const response = await fetch(`http://localhost:5000/user/${user._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    dispatch(updateUser({ user: data }));
    navigate(`/home`);
    changeDisplay();
  };

  const changeImage = (e) => {
    if (e.target.id === "profilePicture" && e.target.files) {
      setProfile(e.target.files[0]);
      setProfileURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.id === "bannerPicture" && e.target.files) {
      setBanner(e.target.files[0]);
      setBannerURL(URL.createObjectURL(e.target.files[0]));
    } else return;
  };

  const changeDisplay = () => {
    setDisplay("none");
  };

  const removeImage = (e) => {
    if (e.target.id === "preview-remove-banner") {
      setBanner(transparentBlob);
      setBannerURL(URL.createObjectURL(transparentBlob));
    } else {
      setProfile(transparentBlob);
      setProfileURL(URL.createObjectURL(transparentBlob));
    }
  };

  return (
    <div className="profile-form-container form-container">
      <form
        className="profile-form form"
        onSubmit={submitChanges}
        autocomplete="off"
      >
        <div className="profile-form-header form-header">
          <button
            className="profile-cancel"
            type="button"
            onClick={changeDisplay}
          >
            ←
          </button>
          <h1>Profile</h1>
          <input type="submit" className="submit-button" />
        </div>
        <div className="form-inputs">
          <div className="input-container">
            <input
              className="username"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              name="username"
              defaultValue={username}
              maxLength="20"
              required
            />
            <label for="username" className="input-label">
              Username
            </label>
            <p className="label-counter">{username.length}/20</p>
          </div>
          <div className="input-container">
            <input
              className="profile-bio"
              onChange={(e) => setBio(e.target.value)}
              type="text"
              name="bio"
              defaultValue={bio}
              maxLength="25"
              required
            />
            <label for="bio" className="input-label">
              Bio
            </label>
            <p className="label-counter">{bio.length}/25</p>
          </div>
        </div>
        <div className="file-upload-container">
          <div className="image-upload">
            <label for="bannerPicture">
              <h1>Banner Image</h1>
            </label>
            <input
              onChange={(e) => changeImage(e)}
              type="file"
              name="bannerPicture"
              id="bannerPicture"
              className="profile-banner"
            />
            <button
              className="preview-image-remove"
              id="preview-remove-banner"
              onClick={(e) => removeImage(e)}
              type="button"
            >
              Clear
            </button>
          </div>
          <div className="image-upload">
            <label for="profilePicture">
              <h1>Profile Picture</h1>
            </label>
            <input
              onChange={(e) => changeImage(e)}
              type="file"
              name="profilePicture"
              id="profilePicture"
              className="profile-picture"
            />
            <button
              className="preview-image-remove"
              id="preview-remove-profile"
              onClick={(e) => removeImage(e)}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="preview-container">
          <div className="preview-profile-page">
            <div className="profile-banner-container">
              <img
                className="profile-banner"
                src={
                  bannerImageURL ||
                  `http://localhost:5000/assets/${bannerImage}`
                }
                alt="preview profile banner"
              />
            </div>
            <div className="profile-picture-container">
              <img
                className="profile-picture"
                src={
                  profileImageURL ||
                  `http://localhost:5000/assets/${profileImage}`
                }
                alt="preview profile"
              />
            </div>
            <div className="profile-name">{username}</div>
            <div className="profile-bio">{bio}</div>
          </div>
          <div className="preview-nav-page">
            <div className="nav-profile" onClick={""}>
              <img
                src={
                  bannerImageURL ||
                  `http://localhost:5000/assets/${bannerImage}`
                }
                className="nav-profile-bg"
                alt="preview nav banner"
              />
              <img
                src={
                  profileImageURL ||
                  `http://localhost:5000/assets/${profileImage}`
                }
                className="nav-profile-image"
                alt="preview nav profile"
              />
              <h1 className="nav-profile-name">{username}</h1>
            </div>
          </div>
        </div>
      </form>
      <div className="profile-form-background form-background" />
    </div>
  );
};

export default ProfileDetails;
