import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="container mx-auto flex flex-wrap justify-center content-center rounded-3xl shadow-cus1 backdrop-blur-md mb-8">
      <div className="px-2 py-3 flex flex-col justify-center content-center items-center w-full">
        <div className="flex justify-between content-center py-5 w-1/2 md:w-1/5 text-3xl">
          <a href="https://facebook.com/cloutgrid">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://instagram.com/cloutgrid">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://youtube.com/cloutgrid">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a href="https://x.com/cloutgrid">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
        </div>

        <div className="flex justify-center content-center font-bold text-lg md:w-3/4 py-5">
          <ul className="flex flex-col md:flex-row justify-around content-center text-center w-full">
            <li>
              <a href="mailto:info@cloutgrid.com">Contact us</a>
            </li>
            {/* <li>
              <a href="/">Our Services</a>
            </li> */}
            <li>
              <Link to={"/privacypolicy"}>Privacy Policy</Link>
            </li>
            <li>
              <Link to={"/eula"}>Terms of Service</Link>
            </li>
            {/* <li>
              <a href="/">Careers</a>
            </li> */}
          </ul>
        </div>

        <div className="flex flex-col justify-center content-center text-center py-5">
          <p>Cloutgrid Copyright © 2025 Cloutgrid - All rights reserved</p>
          <p className="font-bold">
            Designed By: <a href="https://thash.me">@thash</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
