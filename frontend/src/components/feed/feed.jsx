import React, { useState, useEffect } from "react";
import axios from "axios";

import LeftColumn from "./feedLeft";
import MiddleColumn from "./feedMiddle";
import RightColumn from "./feedRight";
import "./feed.css";

const Feed = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          setUser(response.data.user);
        }
      } catch (e) {
        console.log("Error found", e);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="container">
      <div className="left">
        <LeftColumn />
      </div>
      <div className="middle">
        <MiddleColumn />
      </div>
      <div className="right">
        <RightColumn />
      </div>
    </div>
  );
};

export default Feed;
