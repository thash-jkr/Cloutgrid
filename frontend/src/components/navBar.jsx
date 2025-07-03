import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Asynchronous from "../common/dropdown";
import DropdownSearch from "../common/dropdown";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHandshake,
  faPlus,
  faSearch,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import SearchModal from "../modals/searchModal";
import CreateModal from "../modals/createModal";
import PostCreateModal from "../modals/postCreateModal";
import CollabCreateModal from "../modals/collabCreateModal";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [createPostModal, setCreatePostModal] = useState(false);
  const [createCollabModal, setCreateCollabModal] = useState(false);

  const location = useLocation();

  const { access, user, type } = useSelector((state) => state.auth);

  useEffect(() => {
    if (access) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [access]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
    <div>
      <nav
        className={`container mx-auto fixed z-50 transition-all duration-700 ease-in-out ${
          visible ? "top-4 lg:top-6" : "-top-24"
        } left-0 right-0 flex flex-wrap flex-row justify-between items-center px-5 py-2 rounded-2xl shadow ${
          isAuth ? "bg-white" : "backdrop-blur-md"
        }`}
      >
        <div className="center">
          <Link to={"/"}>
            <div className="font-bold text-[#001845] text-3xl">
              CLOUT<span className="text-[#5f646f]">Grid</span>
            </div>
          </Link>
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
            isOpen ? "flex bg-white py-5" : "hidden"
          } lg:flex flex-col lg:flex-row items-center lg:static fixed top-[7vh] left-0 right-0 w-full lg:w-auto lg:bg-none shadow lg:shadow-none rounded-xl z-40`}
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
              {location.pathname === "/" && (
                <>
                  <button
                    className="button-54 group"
                    onClick={() => setSearchModal(true)}
                  >
                    <div className="center flex items-center">
                      <div className="lg:max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
                        <h3 className="mr-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                          Search
                        </h3>
                      </div>
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="transition-transform duration-1000 group-hover:rotate-180"
                      />
                    </div>
                  </button>

                  <button
                    className="button-54 group"
                    onClick={() => setCreateModal(true)}
                  >
                    <div className="center flex items-center">
                      <div className="lg:max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
                        <h3 className="mr-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                          Create
                        </h3>
                      </div>
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="transition-transform duration-1000 group-hover:rotate-180"
                      />
                    </div>
                  </button>

                  <button className="button-54 group">
                    <div className="center flex items-center">
                      <div className="lg:max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-1000 ease-in-out">
                        <h3 className="mr-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                          Collaborations
                        </h3>
                      </div>
                      <FontAwesomeIcon
                        icon={faHandshake}
                        className="transition-transform duration-1000 group-hover:rotate-180"
                      />
                    </div>
                  </button>

                  {/* {type === "business" && (
                  <Link to={"/my-jobs/"} className="my-2 lg:my-0 lg:ml-2">
                    <button className="button-54">Your Collabs</button>
                  </Link>
                )}
                {type === "creator" && (
                  <Link to={"/jobs"} className="my-2 lg:my-0 lg:ml-2">
                    <button className="button-54">Collaborations</button>
                  </Link>
                )} */}
                </>
              )}
              {/* <Link to={"/logout"} className="my-2 lg:my-0 lg:ml-2">
              <button className="button-54">Logout</button>
            </Link> */}
              <Link
                to={"/profile"}
                className="my-2 lg:my-0 lg:ml-2 flex items-center"
              >
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={`${process.env.REACT_APP_API_BASE_URL}${user?.user?.profile_photo}`}
                  alt="Profile"
                />
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
          <FontAwesomeIcon icon={faBars} />
        </button>
      </nav>
      {searchModal && <SearchModal onClose={() => setSearchModal(false)} />}
      {createModal && (
        <CreateModal
          onClose={() => setCreateModal(false)}
          createPost={setCreatePostModal}
          createCollab={setCreateCollabModal}
        />
      )}
      {createPostModal && (
        <PostCreateModal onClose={() => setCreatePostModal(false)} />
      )}
      {createCollabModal && (
        <CollabCreateModal onClose={() => setCreateCollabModal(false)} />
      )}
    </div>
  );
};

export default NavBar;
