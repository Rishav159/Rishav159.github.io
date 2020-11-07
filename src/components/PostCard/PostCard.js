import "./PostCard.scss"
import React from 'react';
import {history} from "../../_helpers/history";

export default function PostCard({post}) {
  let clickHandler = slug => {
    history.push(`/post/${slug}`);
  }
  return (
    <div className="post-card" onClick={() => {clickHandler(post.slug)}}>
      <span className={"title"}>{post.title}</span>
      <ul className={"meta"}>
            <li>Date: 20 / 10 / 2020</li>
            <li>By: Rishav Agarwal</li>
            <li>Estimated Read time: 30mins</li>
          </ul>
    </div>
  )
}
