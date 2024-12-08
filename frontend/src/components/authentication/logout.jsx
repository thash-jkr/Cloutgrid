import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCSRFToken } from "../../getCSRFToken";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/logout/`,
          {
            refresh: localStorage.getItem("refresh"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCSRFToken(),
            },
          },
          { withCredentials: true }
        );

        localStorage.clear();
        axios.defaults.headers.common["Authorization"] = null;
        navigate("/");
      } catch (e) {
        alert("logout not working", e);
      }
    })();
  }, [navigate]);

  return <div></div>;
};

export default Logout;
