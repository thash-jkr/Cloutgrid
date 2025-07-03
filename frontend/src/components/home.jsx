import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import homeCCC from "../assets/home_ccc.png";
import creatorCore from "../assets/creator_core.png";
import collabCore from "../assets/collaboration_core.png";
import selection from "../assets/selecting_creators.png";
import "animate.css";
import NavBar from "./navBar";
import Feed from "./feed/feed";
import BreatheAnimation from "../common/breathe";
import { useSelector } from "react-redux";
import Footer from "../common/Footer";

const LoggedOutHome = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(155deg,rgba(255, 255, 255, 1) 0%,rgba(202, 240, 248, 1) 100%",
      }}
    >
      <div className="container mx-auto flex flex-col justify-center content-center">
        <NavBar />

        <div className="flex h-svh">
          <div className="center-vertical">
            <div className="center-vertical">
              <BreatheAnimation />
              <div className="flex flex-col justify-center items-center my-5">
                <p className="text-xl w-3/4 text-[#3763ab] font-bold text-justify">
                  Are you a visionary creator ready to showcase your talents and
                  land exciting projects? Or a business seeking innovative ideas
                  to elevate your brand? You’re in the right place!
                </p>
              </div>
              <Link to="/register">
                <button className="button-54">Get Started</button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center w-full">
            <img src={homeCCC} alt="Home Right" className="w-1/2 h-auto" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row my-16 lg:my-32">
          <div className="flex justify-center items-center w-full mb-16 lg:mb-0">
            <img src={creatorCore} alt="Home Right" className="w-full h-auto" />
          </div>

          <div className="center-vertical">
            <div className="center-vertical">
              <h1 className="font-serif font-bold text-4xl">For Creator</h1>
              <div className="flex flex-col justify-center items-center my-5">
                <p className="text-xl w-3/4 text-[#3763ab] font-bold text-justify">
                  You’ve built your following—now it’s time to monetize it. With
                  Cloutgrid, discover businesses actively looking to collaborate
                  with creators like you. No algorithms, no guesswork. Just real
                  opportunities, curated for your niche.
                </p>
              </div>
              <Link to="/register/creator">
                <button className="button-54">Join as a Creator</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex lg:hidden justify-center items-center w-full my-8">
          <img src={homeCCC} alt="Home Right" className="w-full h-auto" />
        </div>

        <div className="flex flex-col lg:flex-row my-16 lg:my-32">
          <div className="center-vertical">
            <div className="center-vertical">
              <h1 className="font-serif font-bold text-4xl">For Business</h1>
              <div className="flex flex-col justify-center items-center my-5">
                <p className="text-xl w-3/4 text-[#3763ab] font-bold text-justify">
                  Stop scrolling through endless profiles and cold emails.
                  Cloutgrid makes it simple for businesses to connect with the
                  perfect content creator—whether it’s for your next campaign,
                  product launch, or brand partnership. Post an opportunity and
                  let creators come to you.
                </p>
              </div>
              <Link to="/register/business">
                <button className="button-54">Join as a Business</button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center w-full mt-16 lg:mt-0">
            <img src={collabCore} alt="Home Right" className="w-full h-auto" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row my-16 lg:my-32">
          <div className="flex justify-center items-center w-full mb-16 lg:mb-0">
            <img src={selection} alt="Home Right" className="w-full h-auto" />
          </div>

          <div className="center-vertical">
            <div className="center-vertical">
              <h1 className="font-serif font-bold text-4xl">
                Join Cloutgrid Today
              </h1>
              <div className="flex flex-col justify-center items-center my-5">
                <p className="text-xl w-3/4 text-[#3763ab] font-bold text-justify">
                  It’s not just about being seen—it’s about being seen by the
                  right people. Cloutgrid helps businesses and creators team up
                  to reach target audiences with authentic, tailored content
                  that performs. Say goodbye to wasted reach and hello to
                  results.
                </p>
              </div>
              <Link to="/register">
                <button className="button-54">Join Now</button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
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
