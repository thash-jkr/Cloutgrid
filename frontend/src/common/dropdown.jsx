import React, { useState } from "react";
import { Link } from "react-router-dom";

const DropdownSearch = ({
  searchResults,
  searchQuery,
  setSearchQuery,
  handleSearchChange,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <div className="search-container">
      <div className="form-input">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          style={{
            height: "25px",
            width: "300px",
            fontSize: "15px",
            boxShadow: focus
              ? "rgba(0, 0, 0, 0.24) 0px 3px 8px"
              : "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>
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
              <div className="search-result">{business.user.username}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;
