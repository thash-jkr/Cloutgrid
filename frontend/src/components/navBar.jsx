import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Asynchronous from "../common/dropdown";
import DropdownSearch from "../common/dropdown";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const location = useLocation();

  const { access, user, type } = useSelector((state) => state.auth);

  useEffect(() => {
    if (access) {
      setIsAuth(true);
      console.log(user);
    } else {
      setIsAuth(false);
    }
  }, [access]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/search?q=${e.target.value}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.log("Error fetching search results", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleScroll = () => {
    setIsOpen(false);
    const currentPos = window.scrollY;

    if (currentPos > prevScrollPos) {
      setVisible(false);
    } else setVisible(true);

    setPrevScrollPos(currentPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <nav
      className={`container mx-auto fixed z-50 transition-all duration-700 ease-in-out ${
        visible ? "top-5" : "-top-24"
      } left-0 right-0 flex flex-wrap flex-row justify-between items-center px-5 py-3 rounded-3xl shadow-cus1 backdrop-blur-md`}
    >
      <div className="center">
        <Link to={"/"}>
          <div className="font-bold text-[#001845] text-2xl">
            CLOUT<span className="text-[#5f646f]">Grid</span>
          </div>
        </Link>

        {isAuth && location.pathname === "/" && (
          <DropdownSearch
            searchResults={searchResults}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchChange={handleSearchChange}
          />
        )}
      </div>

      {!isAuth && location.pathname === "/" && (
        <div className="hidden lg:flex justify-center items-center text-2xl font-bold">
          <Link to={"/register/creator/"}>
            <h6 className="mr-5">Creator</h6>
          </Link>
          <h6 className="text-3xl">|</h6>
          <Link to={"/register/business/"}>
            <h6 className="ml-5">Business</h6>
          </Link>
        </div>
      )}

      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } lg:flex flex-col lg:flex-row items-center lg:static fixed top-[7vh] left-0 right-0 w-full lg:w-auto bg-angle-gradient lg:bg-none shadow-md lg:shadow-none rounded-3xl z-40`}
      >
        {!isAuth && (
          <>
            <Link to={"/login"} className="my-2 lg:my-0 lg:ml-2">
              <button className="button-54">Sign In</button>
            </Link>
            <Link to={"/register"} className="my-2 lg:my-0 lg:ml-2">
              <button className="button-54">Register</button>
            </Link>
          </>
        )}

        {isAuth && (
          <>
            {type === "business" && (
              <>
                <Link to={"/job/create"} className="my-2 lg:my-0 lg:ml-2">
                  <button className="button-54">Post a Job</button>
                </Link>
                <Link to={"/my-jobs/"} className="my-2 lg:my-0 lg:ml-2">
                  <button className="button-54">My Jobs</button>
                </Link>
              </>
            )}
            {type === "creator" && (
              <Link to={"/jobs"} className="my-2 lg:my-0 lg:ml-2">
                <button className="button-54">Jobs</button>
              </Link>
            )}
            <Link to={"/logout"} className="my-2 lg:my-0 lg:ml-2">
              <button className="button-54">Logout</button>
            </Link>
            <Link
              to={"/profile"}
              className="my-2 lg:my-0 lg:ml-2 flex items-center"
            >
              <img
                className="hidden lg:block w-8 h-8 rounded-full object-cover"
                src={`${process.env.REACT_APP_API_BASE_URL}${user?.user?.profile_photo}`}
                alt="Profile"
              />
              <button className="block lg:hidden button-54">Profile</button>
            </Link>
          </>
        )}
      </div>

      <button
        className={`lg:hidden text-black text-3xl focus:outline-none transition-transform duration-300 ${
          isOpen ? "rotate-90" : ""
        }`}
        onClick={toggleMenu}
      >
        &#9776;
      </button>
    </nav>
  );
};

export default NavBar;
