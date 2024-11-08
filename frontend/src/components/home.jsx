import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import bg from "../assets/—Pngtree—blogger review concept vetor creative_7689749 (1).png";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import "animate.css";
import NavBar from "./navBar";
import Feed from "./feed/feed";

const LoggedOutHome = () => {
  return (
    <div className="home">
      <div className="home-flex">
        <div className="home-flex-left">
          <div className="home-about">
            <h2 className="animate__animated animate__rubberBand">Connect</h2>
            <h2 className="animate__animated animate__rubberBand">
              Collaborate
            </h2>
            <h2 className="animate__animated animate__rubberBand">Create</h2>
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
          <img src={bg} alt="image" />
        </div>
      </div>
      <footer>
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
              <FontAwesomeIcon icon={faTwitter} />
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
                <a href="/">Privacy Policy</a>
              </li>
              <li>
                <a href="/">Terms & Conditions</a>
              </li>
              <li>
                <a href="/">Career</a>
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

const LoggedInHome = () => {
  const [user, setUser] = useState("");

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
    <div className="home loggedin-home">
      <h1>Welcome {user.name}</h1>
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
