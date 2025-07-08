import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full mx-2">
      <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
