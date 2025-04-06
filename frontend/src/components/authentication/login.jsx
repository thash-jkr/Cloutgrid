import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";
import "./auth.css";

const Login = () => {
  const [type, setType] = useState("creator");

  return (
    <div className="login-main">
      <Link to={"/"}>
        <div className="reg-logo logo">
          CLOUT<span className="logo-side">Grid</span>
        </div>
      </Link>
      {type === "creator" ? (
        <LoginCreator setType={setType} />
      ) : (
        <LoginBusiness setType={setType} />
      )}
    </div>
  );
};

export default Login;
