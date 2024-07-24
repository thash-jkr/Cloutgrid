import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";
import img from "../../assets/jamie-street-_94HLr_QXo8-unsplash.jpg";
import "./auth.css";

const Login = () => {
  const [type, setType] = useState("Creator");
  const toggleCreator = () => setType("Creator");
  const toggleBusiness = () => setType("Business");

  return (
    <div className="login-main">
      <div className="login-body">
        <Link to={"/"}>
          <div className="reg-logo logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>
        <div className="login">
          <div className="login-buttons">
            <button className="button-54" onClick={toggleCreator}>
              Creator
            </button>
            <button className="button-54" onClick={toggleBusiness}>
              Business
            </button>
          </div>
          {type === "Creator" ? <LoginCreator /> : <LoginBusiness />}
        </div>
      </div>
      <div className="login-img-container">
        <img className="login-img" src={img} alt="login" />
      </div>
    </div>
  );
};

export default Login;