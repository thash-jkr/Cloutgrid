import React from "react";
import NavBar from "../common/navBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutLocal } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { type } = useSelector((state) => state.auth);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/delete/${type}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("type");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common.Authorization;
        dispatch(logoutLocal());
      }
    } catch (error) {
      dispatch(logoutLocal);
      console.error("Logout Error", error);
    }
  };

  return (
    <div className="container mx-auto flex items-start mt-20 lg:mt-28 noselect">
      <NavBar />

      <div
        className="w-full h-[75vh] min-h-[100px] flex mx-3 lg:mx-0 border rounded-2xl bg-white 
               shadow p-2"
      >
        <div className="flex flex-col p-10">
          <h1 className="font-bold text-2xl">
            Are you sure that you want to{" "}
            <span className="text-red-500">delete your Cloutgrid account?</span>
          </h1>
          <p className="font-bold">
            This action cannot be undone. You will lose all your data. Your
            account and all the related data will be deleted immedietly!
          </p>
          <div className="mt-5">
            <button
              className="button-54"
              onClick={() =>
                window.confirm(
                  "Are you sure you want to delete your account? This action cannot be undone. Your account and all the related data will be deleted immedietly!"
                )
                  ? handleDelete()
                  : navigate("/")
              }
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
