import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../../state/userSlice";
import "./comments.scss";
import CommentsRender from "./commentsRender";

const Comments = ({ comments, postID }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState(null);
  const { _id } = user;

  const postComment = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${postID}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userID: _id, content: content }),
      }
    );

    const data = await response.json();
    dispatch(updatePost(data));
    setContent("");
  };

  return (
    <div className="comments-container">
      <>
        {comments.map((comment) => {
          return (
            <CommentsRender userID={comment.userID} content={comment.content} />
          );
        })}
      </>
      <div className="comment-input">
        <textarea
          onChange={(e) => setContent(e.target.value)}
          type="text"
          name="content"
          className="post-text-content"
          placeholder="What's on your mind?"
          defaultValue={""}
          value={content}
          required
        />
        <button onClick={postComment} type="button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Comments;

//Edit comment
////PATCH

// const editComment = async () => { const response = await fetch(
//   `http://localhost:5000/posts/${postID}/delete`,
//   {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ userID: _id }),
//   }
//   dispatch(deletePost({ post: data }));
// );};

//Delete comment
////PATCH

// const deleteComment = async () => {};
// console.log(user);
