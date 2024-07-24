import React from "react";
import LeftColumn from "./feedLeft";
import MiddleColumn from "./feedMiddle";
import RightColumn from "./feedRight";

const Feed = () => {
  return (
    <div className="w3-container w3-content container">
      <div className="w3-row">
        <LeftColumn />
        <MiddleColumn />
        <RightColumn />
      </div>
    </div>
  );
};

export default Feed;
