import React from "react";
import PostMap from "../PostController";
import PostCard from "../PostCard/PostCard";

function LandingPage() {
  let posts = Object.keys(PostMap).map(key => PostMap[key]).sort();
  return (
    <div className="landing-page">
      <h2>Recent Posts</h2>
      <div className="posts">
        {posts.map((post, index) => {
          return (
            <PostCard post={post} key={index} />
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;