import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import homeCCC from "../assets/home_ccc.png";
import creatorCore from "../assets/creator_core.png";
import businessCore from "../assets/business_core.png";
import collabCore from "../assets/collaboration_core.png";
import selection from "../assets/selecting_creators.png";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import "animate.css";
import NavBar from "./navBar";
import Feed from "./feed/feed";
import BreatheAnimation from "../common/breathe";
import { useSelector } from "react-redux";

const LoggedOutHome = () => {
  return (
    <div className="home">
      <NavBar />
      <div className="home-flex">
        <div className="home-flex-left">
          <div className="home-about">
            <BreatheAnimation />
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

      <div className="home-flex">
        <div className="home-flex-right">
          <img src={creatorCore} alt="Home Right" />
        </div>

        <div className="home-flex-left">
          <div className="home-about">
            <h1 style={{ fontFamily: "Snell Roundhand, cursive" }}>
              For Creator
            </h1>
            <p>
              You’ve built your following—now it’s time to monetize it. With
              Cloutgrid, discover businesses actively looking to collaborate
              with creators like you. No algorithms, no guesswork. Just real
              opportunities, curated for your niche.
            </p>
            <Link to="/register/creator">
              <button className="button-54">Join as a Creator</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="home-flex">
        <div className="home-flex-left">
          <div className="home-about">
            <h1 style={{ fontFamily: "Snell Roundhand, cursive" }}>
              For Business
            </h1>
            <p>
              Stop scrolling through endless profiles and cold emails. Cloutgrid
              makes it simple for businesses to connect with the perfect content
              creator—whether it’s for your next campaign, product launch, or
              brand partnership. Post an opportunity and let creators come to
              you.
            </p>
            <Link to="/register/business">
              <button className="button-54">Join as a Business</button>
            </Link>
          </div>
        </div>

        <div className="home-flex-right">
          <img src={collabCore} alt="Home Right" />
        </div>
      </div>

      <div className="home-flex">
        <div className="home-flex-right">
          <img src={selection} alt="Home Right" />
        </div>

        <div className="home-flex-left">
          <div className="home-about">
            <h1 style={{ fontFamily: "Snell Roundhand, cursive" }}>
              Join Cloutgrid Today
            </h1>
            <p>
              It’s not just about being seen—it’s about being seen by the right
              people. Cloutgrid helps businesses and creators team up to reach
              target audiences with authentic, tailored content that performs.
              Say goodbye to wasted reach and hello to results.
            </p>
            <Link to="/register">
              <button className="button-54">Join Now</button>
            </Link>
          </div>
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
            Cloutgrid Copyright © 2025 Cloutgrid - All rights reserved ||
            Designed By: <a href="https://thash.me">thash</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Home = () => {
  const [auth, setAuth] = useState(false);
  const access = useSelector((state) => state.auth.access);

  useEffect(() => {
    if (access) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [access]);

  return <>{auth ? <Feed /> : <LoggedOutHome />}</>;
};

export default Home;
