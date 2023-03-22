import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostsFeed } from "../../state/userSlice";
import Posts from "./posts";

const GetPost = ({ userID, state }) => {
  let url;
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  //Get Users Posts if state = user
  const getPosts = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    dispatch(setPostsFeed({ posts: data }));
  };

  useEffect(() => {
    if (state === "Profile") {
      url = `http://localhost:5000/posts/${userID}/posts`;
    } else if (state === "Likes") {
      url = `http://localhost:5000/posts/${userID}/posts/liked`;
    } else if (state === "Home") {
      url = `http://localhost:5000/posts`;
    } else return;
    getPosts();
  }, [userID, state]);

  return (
    <div className="posts-feed-container">
      {posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userID,
            username,
            userImagePath,
            content,
            imagePath,
            likes,
            comments,
          }) => {
            return (
              <Posts
                postID={_id}
                postUserID={userID}
                user={username}
                userImagePath={userImagePath}
                content={content}
                contentImagePath={imagePath}
                likes={likes}
                comments={comments}
              />
            );
          }
        )
      ) : (
        <div className="no-posts">No posts</div>
      )}
    </div>
  );
};

export default GetPost;
