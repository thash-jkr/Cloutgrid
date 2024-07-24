import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(
          "http://192.168.1.106:8000/logout/",
          {
            refresh: localStorage.getItem("refresh"),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
          { withCredentials: true }
        );

        console.log("logout", data);
        localStorage.clear();
        axios.defaults.headers.common["Authorization"] = null;
        navigate("/");
        window.location.reload()
      } catch (e) {
        console.log("logout not working", e);
      }
    })();
  }, [navigate]);

  return <div></div>;
};

export default Logout;
