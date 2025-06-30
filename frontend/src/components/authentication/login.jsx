import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";
import "./auth.css";
import NavBar from "../navBar";

const Login = () => {
  const [type, setType] = useState("creator");

  return (
    <div className="container h-dvh mx-auto flex justify-center items-center">
      <NavBar />
      {type === "creator" ? (
        <LoginCreator setType={setType} />
      ) : (
        <LoginBusiness setType={setType} />
      )}
    </div>
  );
};

export default Login;
