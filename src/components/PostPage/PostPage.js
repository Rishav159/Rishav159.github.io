import "./PostPage.scss";
import React from "react";
import { useParams } from "react-router-dom";
import PostMap from "../PostController";

function PostPage() {
  let params = useParams();
  let postSlug = params && params.slug;
  return (
    <div className={"post-holder"}>
      <div className={"headings"}>
        <div className={"left-heading"}>
          <span className={"title"}>{PostMap[postSlug] ? PostMap[postSlug].title : ""}</span>
          <ul className={"subtitle"}>
            <li>Date: 20 / 10 / 2020</li>
            <li>By: Rishav Agarwal</li>
            <li>Estimated Read time: 30mins</li>
          </ul>
        </div>
        <div className={"keypoints"}>
          <div>ARTICLE KEYPOINTS</div>
          <ul>
            {PostMap[postSlug] &&
              PostMap[postSlug].keypoints.map((point, index) => {
                return (
                  <li key={index} className={"keypoint"}>
                    {point}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      {PostMap[postSlug] ? PostMap[postSlug].component() : <h2>Not Found</h2>}
    </div>
  );
}

export default PostPage;
