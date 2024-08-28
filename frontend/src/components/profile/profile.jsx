import React, { useEffect, useState } from "react";
import CreatorProfile from "./profileCreator";
import BusinessProfile from "./profileBusiness";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user-type/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setUserType(response.data.type);
      } catch (error) {
        console.error("Error fetching user type", error);
      }
    };

    fetchUserType();
  }, []);

  if (!userType) {
    return <div>Loading...</div>;
  }

  return userType === "creator" ? <CreatorProfile /> : <BusinessProfile />;
};

export default Profile;
