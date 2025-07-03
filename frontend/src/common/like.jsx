import React from "react";
import styled from "styled-components";

const Checkbox = ({ like, liked }) => {
  return (
    <StyledWrapper liked={liked}>
      <div className="triangle-container" title="Like">
        <input
          type="checkbox"
          className="checkbox"
          checked={liked}
          onChange={like}
        />
        <div className="svg-container">
          <svg
            viewBox="0 0 24 24"
            className="svg-triangle"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5 
           C11.7 5, 11.4 5.2, 11.2 5.5 
           L4.5 19 
           C4.3 19.3, 4.4 19.7, 4.7 19.9 
           C5 20, 5.4 20, 5.7 19.7 
           L12 7 
           L18.3 19.7 
           C18.6 20, 19 20, 19.3 19.9 
           C19.6 19.7, 19.7 19.3, 19.5 19 
           L12.8 5.5 
           C12.6 5.2, 12.3 5, 12 5 
           Z"
            />
          </svg>
          <svg
            className="svg-celebrate"
            width={100}
            height={100}
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="10,10 20,20" />
            <polygon points="10,50 20,50" />
            <polygon points="20,80 30,70" />
            <polygon points="90,10 80,20" />
            <polygon points="90,50 80,50" />
            <polygon points="80,80 70,70" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .triangle-container {
    position: relative;
    width: 30px;
    height: 30px;
    transition: 0.3s;
  }

  .checkbox {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 20;
    cursor: pointer;
  }

  .svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .svg-triangle {
    position: absolute;
    width: 100%;
    height: 100%;
    stroke: ${({ liked }) => (liked ? "#001845" : "black")};
    fill: ${({ liked }) => (liked ? "#001845" : "transparent")};
    stroke-width: 2px;
    transition: all 0.3s ease;
  }

  .svg-celebrate {
    position: absolute;
    display: ${({ liked }) => (liked ? "block" : "none")};
    stroke: #001845;
    fill: #001845;
    stroke-width: 2px;
    animation: keyframes-svg-celebrate 0.5s forwards;
  }

  @keyframes keyframes-svg-celebrate {
    0% {
      transform: scale(0);
    }
    50% {
      opacity: 1;
      filter: brightness(1.5);
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
      display: none;
    }
  }
`;

export default Checkbox;
