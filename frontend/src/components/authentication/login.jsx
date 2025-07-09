import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";
import "./auth.css";
import NavBar from "../../common/navBar"

const Login = () => {
  const [type, setType] = useState("creator");

  return (
    <div
      style={{
        background:
          "linear-gradient(155deg,rgba(255, 255, 255, 1) 0%,rgba(202, 240, 248, 1) 100%",
      }}
      className="px-3"
    >
      <div className="container h-dvh mx-auto flex justify-center items-center">
        <NavBar />
        {type === "creator" ? (
          <LoginCreator setType={setType} />
        ) : (
          <LoginBusiness setType={setType} />
        )}
      </div>
    </div>
  );
};

export default Login;
