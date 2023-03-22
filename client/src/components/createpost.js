import { useEffect, useState } from "react";
import "./createpost.scss";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../state/userSlice";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ setDisplay, postData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState(null);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [state, setState] = useState(null);

  const { _id, profilePicture } = user;

  useEffect(() => {
    //If no post data was provided, create new post
    if (postData === "") {
      setState("create");
    }
    //If post data was provided, edit current post
    else {
      setState("edit");
      setContent(postData.content);
      setImage(postData.contentImagePath);
    }
  }, []);

  const createFormData = () => {
    const formData = new FormData();
    formData.append("userID", _id);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", null);
    }

    return formData;
  };

  const submitPost = async (e) => {
    e.preventDefault();
    const formData = createFormData();
    console.log(image);

    await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    changeDisplay();
    navigate(`/home`);
    setContent("");
    setImage(null);
  };

  const editPost = async (e) => {
    e.preventDefault();
    const formData = createFormData();
    const response = await fetch(
      `http://localhost:5000/posts/${postData.postID}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    changeDisplay();
    navigate(`/home`);
    dispatch(updatePost({ post: data }));
  };

  const changeDisplay = () => {
    setDisplay("none");
  };

  const setImagePreview = (e) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setImageURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeImagePreview = () => {
    setImage(null);
    setImageURL(null);
  };

  return (
    <div className="post-form-container form-container">
      <form
        className="post-form form"
        onSubmit={state === "create" ? submitPost : editPost}
      >
        <div className="post-header form-header">
          <button className="post-cancel" onClick={() => changeDisplay()}>
            ←
          </button>
          <h1>Post</h1>
          <input type="submit" className="submit-button" value="Post" />
        </div>
        <div className="post-body">
          <img
            className="post-profile-picture"
            src={`http://localhost:5000/assets/${profilePicture}`}
            alt="profile"
          />
          <div className="post-preview-container">
            <div className="post-content">
              <textarea
                onChange={(e) => setContent(e.target.value)}
                type="text"
                name="content"
                className="post-text-content"
                placeholder="What's on your mind?"
                defaultValue={postData.content || ""}
                maxLength="100"
              />
              {(imageURL || image) && (
                <img
                  className="post-file-preview"
                  src={imageURL || `http://localhost:5000/assets/${image}`}
                  alt="post-preview"
                />
              )}
            </div>
            <div className="content-length">
              {`${0 + content && content.length}`}/100
            </div>
            <div className="image-upload">
              <label for="fileInput">
                <h1>File Upload</h1>
              </label>
              <input
                onChange={setImagePreview}
                type="file"
                name="image"
                className="post-file"
                id="fileInput"
              />
              <button
                className="preview-image-remove"
                id="preview-remove-banner"
                onClick={removeImagePreview}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="post-form-background form-background" />
    </div>
  );
};

export default CreatePost;
