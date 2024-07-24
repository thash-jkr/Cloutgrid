import React from "react";
import { Link } from "react-router-dom";
import img from "../../assets/reg-cropped.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./auth.css";

const Register = () => {
  return (
    <div className="reg-main">
      <div className="reg-body">
        <Link to={"/"}>
          <div className="reg-logo logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>
        <h1>Join CloutGrid</h1>
        <div className="reg-card">
          <Link to={"/register/creator"}>
            <div className="card">
              <div className="card_bg"></div>
              <div className="card-content">
                <h3>Creator</h3>
                <FontAwesomeIcon className="reg-arrow" icon={faArrowRight} />
              </div>
            </div>
          </Link>
          <Link to={"/register/business"}>
            <div className="card">
              <div className="card_bg"></div>
              <div className="card-content">
                <h3>Business</h3>
                <FontAwesomeIcon className="reg-arrow" icon={faArrowRight} />
              </div>
            </div>
          </Link>
        </div>
        <div className="reg-footer">
          <p>Already have an account?</p>
          <Link to={"/login"}>Login</Link>
        </div>
      </div>
      <div className="reg-img-container">
        <img className="reg-img" src={img} />
      </div>
    </div>
  );
};

export default Register;
