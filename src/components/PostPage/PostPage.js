import React from "react";
import { useParams } from "react-router-dom";
import PostMap from "../PostController";

function PostPage() {
  let params = useParams();
  let postSlug = params && params.slug;
  return (
    <div>
      <h1>Post</h1>
      {PostMap[postSlug]? PostMap[postSlug]() : <h2>Not Found</h2>}
    </div>
  );
};

export default PostPage;