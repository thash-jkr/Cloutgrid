import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import homeCCC from "../assets/home_ccc.png"
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faXTwitter
} from "@fortawesome/free-brands-svg-icons";
import "animate.css";
import NavBar from "./navBar";
import Feed from "./feed/feed";
import BreatheAnimation from "../common/breathe";
import Keyboard from "../common/keyboard";

const LoggedOutHome = () => {
  return (
    <div className="home">
      <div className="home-flex">
        <div className="home-flex-left">
          <div className="home-about">
            <BreatheAnimation /> 
            {/* <Keyboard /> */}
            <p>
              Are you a visionary creator ready to showcase your talents and
              land exciting projects? Or a business seeking innovative ideas to
              elevate your brand? You’re in the right place!
            </p>
            <Link to="/register">
              <button className="button-54">Get Started</button>
            </Link>
          </div>
        </div>
        <div className="home-flex-right">
          <img src={homeCCC} alt="Home Right" />
        </div>
      </div>
      <footer className="footer-container">
        <div className="footer">
          <div className="row footer-icons-row">
            <a className="footer-icons" href="facebook.com/cloutgrid">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a className="footer-icons" href="https://instagram.com/cloutgrid">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
          </div>

          <div className="row footer-links">
            <ul>
              <li>
                <a href="/">Contact us</a>
              </li>
              <li>
                <a href="/">Our Services</a>
              </li>
              <li>
                <Link to={"/privacypolicy"}>Privacy Policy</Link>
              </li>
              <li>
                <a href={"/eula"}>Terms of Service</a>
              </li>
              <li>
                <a href="/">Careers</a>
              </li>
            </ul>
          </div>

          <div className="row">
            Cloutgrid Copyright © 2024 Cloutgrid - All rights reserved ||
            Designed By: <a href="https://thash.me">thash</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Home = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access")) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <>
      <NavBar />
      {auth ? <Feed /> : <LoggedOutHome />}
    </>
  );
};

export default Home;
