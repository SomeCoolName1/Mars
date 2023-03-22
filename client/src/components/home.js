import "./home.scss";
import GetPost from "./posts/getPosts";

const Home = () => {
  return (
    <div className="home-container">
      <div className="mobile-nav-container">
        <div className="home-button mobile-nav-option"></div>
        <div className="search-bar"></div>
        <div className="friend-button mobile-nav-option"></div>
      </div>
      <GetPost userID={""} state="Home" />
    </div>
  );
};

export default Home;
