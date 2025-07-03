import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SearchModal = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  });

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

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Search</h1>
          <button className="close-modal" id="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="modal-body divide-y">
          <div className="w-full my-2 center">
            <input
              type="text"
              className="border h-full w-3/4 p-3 rounded-2xl shadow"
              placeholder="Start Typing ..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="w-full h-full overflow-y-scroll noscroll mb-1">
            {searchQuery && (
              <div>
                {searchResults.creators?.map((creator) => (
                  <Link
                    to={`/profiles/${creator.user.username}`}
                    key={creator.id}
                    onClick={() => setSearchQuery("")}
                    className="border-b"
                  >
                    <div className="flex justify-start items-center p-3">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${creator?.user.profile_photo}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <h1 className="font-bold">{creator?.user.name}</h1>
                    </div>
                  </Link>
                ))}

                {searchResults.businesses?.map((business) => (
                  <Link
                    to={`/profiles/${business.user.username}`}
                    key={business.id}
                    onClick={() => setSearchQuery("")}
                  >
                    <div className="flex justify-start items-center p-2">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${business?.user.profile_photo}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <h1 className="font-bold">{business?.user.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
