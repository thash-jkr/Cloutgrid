import React, { useState } from "react";

const DropdownSearchSelect = ({
  searchResults,
  searchQuery,
  handleSearchChange,
  collab,
  setCollab,
}) => {
  const [DropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="search-container">
      <input
        type="text"
        value={collab || searchQuery}
        onChange={(e) => {
          handleSearchChange(e.target.value);
          setDropdownOpen(true);
        }}
        onFocus={() => {
          setDropdownOpen(true);
        }}
        placeholder="Search for businesses..."
        className="navbar-search"
      />
      {DropdownOpen && searchResults.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "150px",
            overflowY: "auto",
            borderRadius: "15px",
            backgroundColor: "#fff",
            listStyle: "none",
            marginTop: 5,
            padding: "0",
            zIndex: 10,
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            scrollbarWidth: "none",
          }}
        >
          {searchResults.map((b) => (
            <li
              key={b.user.username}
              onClick={() => {
                setCollab(b.user.username);
                setDropdownOpen(false);
              }}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {b.user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSearchSelect;
