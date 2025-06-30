// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scan all React source files
  ],
  theme: {
    extend: {
      boxShadow: {
        cus1: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      },
      backgroundImage: {
        "login-bg": "url('./assets/login_backgrounds_semi/1.png')",
        "angle-gradient":
          "linear-gradient(155deg, rgba(255, 255, 255, 1) 0%, rgba(202, 240, 248, 1) 100%)",
      },
    },
  },
  plugins: [],
};
