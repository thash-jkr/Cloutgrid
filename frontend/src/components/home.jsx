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

const LoggedOutHome = () => {
  return (
    <div className="home">
      <div className="home-flex">
        <div className="home-flex-left">
          <div className="home-about">
            <h1>Marketplace for Influencers and Brands</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              iure architecto nisi reiciendis in ducimus illo esse, sint veniam
              voluptates voluptas minus sunt atque et alias laborum eos omnis
              cupiditate.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis qui
              nisi excepturi sint, dolorum soluta sed veniam quos, magni
              adipisci accusantium consectetur voluptatum corrupti perspiciatis
              facere impedit. Soluta, inventore provident.
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
          <div className="row">
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a className="footer-icons" href="/">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>

          <div className="row">
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
            Designed By: thash_jkr
          </div>
        </div>
      </footer>
    </div>
  );
};

const LoggedInHome = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://192.168.1.106:8000", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (data) {
          console.log(localStorage.getItem("access"));
          setMessage(data.user.email);
          setUser(data.user.name);
        }
      } catch (e) {
        console.log("Error found", e);
      }
    })();
  }, []);

  return (
    <div className="home">
      <h1>Welcome Back {user}</h1>
      <h3>Your email is {message}</h3>
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
      {auth ? <LoggedInHome /> : <LoggedOutHome />}
    </>
  );
};

export default Home;
