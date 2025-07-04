import React, { useState, useEffect } from "react";
import axios from "axios";

import LeftColumn from "./feedLeft";
import MiddleColumn from "./feedMiddle";
import RightColumn from "./feedRight";
import "./feed.css";
import NavBar from "../navBar";

const Feed = () => {
  return (
    <div className="container mx-auto flex items-start mt-20 lg:mt-28">
      <NavBar />
      <div className="hidden lg:flex basis-1/4 w-full noselect">
        <LeftColumn />
      </div>
      <div className="flex lg:basis-2/4">
        <MiddleColumn />
      </div>
      <div className="hidden lg:flex basis-1/4 w-full noselect">
        <RightColumn />
      </div>
    </div>
  );
};

export default Feed;
