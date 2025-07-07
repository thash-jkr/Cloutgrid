import React from "react";
import { Link } from "react-router-dom";
import gradient_bg from "../../assets/gradient_bg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./auth.css";
import NavBar from "../navBar";

const Register = () => {
  return (
    <div className="h-dvh w-dvw mx-auto flex justify-center items-center bg-[linear-gradient(155deg,_rgba(255,255,255,1)_0%,_rgba(206,193,245,1)_100%)]">
      <NavBar />
      <div className="flex basis-1/3 flex-col justify-center items-center">
        <h1 className="font-bold text-4xl mb-10">
          Join CLOUT<span className="text-orange-500">Grid</span>
        </h1>

        <div className="flex flex-col md:flex-row">
          <Link to={"/register/creator"}>
            <div className="card group">
              <div className="flex flex-col justify-center items-center">
                <h3 className="font-bold text-3xl md:text-2xl mb-1">Creator</h3>
                <FontAwesomeIcon
                  className="transition-all transform ease-in-out duration-500 group-hover:translate-x-4 text-xl"
                  icon={faArrowRight}
                />
              </div>
            </div>
          </Link>

          <Link to={"/register/business"}>
            <div className="card group">
              <div className="flex flex-col justify-center items-center">
                <h3 className="font-bold text-3xl md:text-2xl mb-1">Business</h3>
                <FontAwesomeIcon
                  className="transition-all transform ease-in-out duration-500 group-hover:translate-x-4 text-xl"
                  icon={faArrowRight}
                />
              </div>
            </div>
          </Link>
        </div>

        <div className="flex justify-center items-center mt-10 text-sm font-bold">
          <p>Already have an account?</p>
          <Link
            to={"/login"}
            className="text-orange-500 hover:text-red-500 font-extrabold ml-2"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="hidden md:flex basis-2/3 h-dvh">
        <img className="object-cover" src={gradient_bg} alt="Couples" />
      </div>
    </div>
  );
};

export default Register;
