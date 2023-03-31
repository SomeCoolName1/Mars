import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost, deletePost } from "../../state/userSlice";
import Comments from "./comments";
import CreatePost from "../createpost";
import "./posts.scss";
import { useNavigate } from "react-router-dom";

const Posts = ({
  postID,
  postUserID,
  user,
  userImagePath,
  content,
  contentImagePath,
  likes,
  comments,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  const isLiked = Boolean(likes[_id]);
  const likeCount = Object.keys(likes).length;
  const currentState = {
    postID: postID,
    userID: postUserID,
    user: user,
    userImagePath: userImagePath,
    content: content,
    contentImagePath: contentImagePath,
  };

  const [displayComments, setCommentDisplay] = useState(false);
  const [displayCreate, setDisplay] = useState(false);
  const [displayEdits, setDisplayEdits] = useState(false);

  const likePost = async () => {
    const response = await fetch(`http://localhost:5000/posts/${postID}/like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userID: _id }),
    });
    const data = await response.json();
    dispatch(updatePost({ post: data }));
  };

  //Add are you sure button
  const deleteSelectedPost = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${postID}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userID: _id }),
      }
    );
    const data = await response.json();
    setCommentDisplay(false);
    setDisplayEdits(false);
    dispatch(deletePost({ post: data }));
  };

  const updateSelectedPost = () => {
    if (displayCreate === false) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  };

  const displayCommentsTab = () => {
    if (displayComments === false) {
      setCommentDisplay(true);
    } else {
      setCommentDisplay(false);
    }
  };

  const displayEditsTab = () => {
    if (displayEdits === false) {
      setDisplayEdits(true);
    } else {
      setDisplayEdits(false);
    }
  };

  const navigateToProfile = () => {
    navigate(`/user/${postUserID}`);
  };

  return (
    <div className="posts-container">
      <div className="posts-card">
        <div className="posts-header">
          <div className="posts-author" onClick={navigateToProfile}>
            <img
              className="posts-author-image"
              src={`http://localhost:5000/assets/${userImagePath}`}
              alt="profile"
            />
            <div className="posts-author-name">{user}</div>
          </div>

          {_id === postUserID ? (
            displayEdits === true ? (
              <div className="posts-edit">
                <button
                  className="posts-edit-expand edit-button"
                  onClick={displayEditsTab}
                >
                  →
                </button>
                <button onClick={() => updateSelectedPost()}>Edit</button>
                <button onClick={deleteSelectedPost}>Delete</button>
              </div>
            ) : (
              <button
                className="posts-edit-retract edit-button"
                onClick={displayEditsTab}
              >
                ←
              </button>
            )
          ) : (
            <></>
          )}
        </div>
        <div className="posts-content">{content}</div>
        {contentImagePath !== null ? (
          <div className="posts-image">
            {contentImagePath && (
              <img
                src={`http://localhost:5000/assets/${contentImagePath}`}
                alt="post content"
              />
            )}
          </div>
        ) : (
          <></>
        )}
        <div className="posts-footer">
          <div className="posts-likes" onClick={likePost}>
            {isLiked ? <div>♥ {likeCount}</div> : <div>♡ {likeCount}</div>}
          </div>
          <div className="posts-comments" onClick={displayCommentsTab}>
            Comments
          </div>
        </div>
        {displayComments === true ? (
          <>
            <Comments postID={postID} comments={comments} />
          </>
        ) : (
          <></>
        )}
      </div>
      {displayCreate === true ? (
        <CreatePost
          display={displayCreate}
          setDisplay={setDisplay}
          postData={currentState}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Posts;
