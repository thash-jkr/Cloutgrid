import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const [type, setType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    const fetchType = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.106:8000/user-type",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setType(response.data.type);
      } catch (error) {
        console.log("Error fetching user type", error);
      }
    };

    if (isAuth) {
      fetchType();
    }
  }, [isAuth]);

  useEffect(() => {
    setIsAuth(localStorage.getItem("access") !== null);

    const fetchProfilePhoto = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          console.log("No access token found");
          return;
        }
        const response = await axios.get(
          "http://192.168.1.106:8000/profile-photo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data && response.data.profile_photo) {
          setProfile(response.data.profile_photo);
        } else {
          console.log("No profile photo found in the response");
        }
      } catch (error) {
        console.log("Error fetching photo", error);
      }
    };

    if (isAuth) {
      fetchProfilePhoto();
    }
  }, [isAuth]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      try {
        const response = await axios.get(
          `http://192.168.1.106:8000/search?q=${e.target.value}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.log("Error fetching search results", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={"/"}>
          <div className="logo">
            CLOUT<span className="logo-side">Grid</span>
          </div>
        </Link>

        {isAuth && location.pathname === "/" && (
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="navbar-search"
            />
            {searchQuery && (
              <div className="search-dropdown">
                {searchResults.creators?.map((creator) => (
                  <Link
                    to={`/profiles/${creator.user.username}`}
                    key={creator.user.id}
                    onClick={() => setSearchQuery("")}
                  >
                    <div className="search-result">{creator.user.username}</div>
                  </Link>
                ))}
                {searchResults.businesses?.map((business) => (
                  <Link
                    to={`/profiles/${business.user.username}`}
                    key={business.user.id}
                    onClick={() => setSearchQuery("")}
                  >
                    <div className="search-result">
                      {business.user.username}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!isAuth && (
        <div className="navbar-middle">
          <Link to={"/register/creator/"}>
            <h6>Creator</h6>
          </Link>
          |
          <Link to={"/register/business/"}>
            <h6>Business</h6>
          </Link>
        </div>
      )}

      <div className={`navbar-items ${isOpen ? "open" : ""}`}>
        {!isAuth && (
          <>
            <Link to={"/login"}>
              <button className={`button-54 ${isOpen ? "open" : ""}`}>
                Sign In
              </button>
            </Link>
            <Link to={"/register"}>
              <button className={`button-54 ${isOpen ? "open" : ""}`}>
                Register
              </button>
            </Link>
          </>
        )}
        {isAuth && (
          <>
            {type === "business" && (
              <>
                <Link to={"/job/create"}>
                  <button className="button-54">Post a Job</button>
                </Link>
                <Link to={"/my-jobs/"}>
                  <button className="button-54">My Jobs</button>
                </Link>
              </>
            )}
            {type === "creator" && (
              <Link to={"/jobs"}>
                <button className="button-54">Jobs</button>
              </Link>
            )}
            <Link to={"/logout"}>
              <button className={`button-54 ${isOpen ? "open" : ""}`}>
                Logout
              </button>
            </Link>
            <Link to={"/profile"}>
              <img
                className={`logo-profile ${isOpen ? "open" : ""}`}
                src={`http://192.168.1.106:8000${profile}`}
                alt="Profile"
              />
              <button className={`${isOpen ? "open button-54" : "button-mobile"}`}>Profile</button>
            </Link>
          </>
        )}
      </div>
      <button className={`hamburger ${isOpen ? "rotate": ""}`} onClick={toggleMenu}>
        &#9776;
      </button>
    </nav>
  );
};

export default NavBar;
