import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Profiles = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await axios.get("http://192.168.1.106:8000/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLoggedInUsername(response.data.user.username);
      } catch (err) {
        setError("Could not fetch logged-in user information");
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (username === loggedInUsername) {
          navigate("/profile");
        }
        const response = await axios.get(
          "http://192.168.1.106:8000/profiles/" + username,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response) {
          setProfileData(response.data);
        }
        const isFollowingResponse = await axios.get(
          `http://192.168.1.106:8000/profiles/${username}/is_following/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsFollowing(isFollowingResponse.data.is_following);
      } catch (err) {
        setError("Profile not found");
      }
    };

    fetchProfile();
  }, [username, loggedInUsername, navigate]);

  const handleFollow = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      await axios.post(
        `http://192.168.1.106:8000/profiles/${username}/follow/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsFollowing(true);
    } catch (err) {
      console.error("Error following user", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      await axios.post(
        `http://192.168.1.106:8000/profiles/${username}/unfollow/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsFollowing(false);
    } catch (err) {
      console.error("Error unfollowing user", err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <Link to={"/"}>
          <div className="logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>
        <div className="navbar-items">
          <Link to={"/logout"}>
            <li className="button-54">Logout</li>
          </Link>
        </div>
      </nav>
      <h1>{profileData.user.username}'s Profile</h1>
      <p>Email: {profileData.user.email}</p>
      <p>Date of Birth: {profileData.date_of_birth}</p>
      <p>Area: {profileData.area}</p>
      <p>Followers: {profileData.user.followers_count}</p>
      <p>Following: {profileData.user.following_count}</p>
      {isFollowing ? (
        <button onClick={handleUnfollow}>Unfollow</button>
      ) : (
        <button onClick={handleFollow}>Follow</button>
      )}
    </div>
  );
};

export default Profiles;
