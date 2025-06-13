import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../slices/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((error) => {
        alert("Logout Failed", error)
      })
  }, [dispatch, navigate]);

  return <div></div>;
};

export default Logout;
