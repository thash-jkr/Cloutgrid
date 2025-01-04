import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";
// import img from "../../assets/jamie-street-_94HLr_QXo8-unsplash.jpg";
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
      {/* <div className="login-img-container">
        <img className="login-img" src={img} alt="login" />
      </div> */}
    </div>
  );
};

export default Login;
