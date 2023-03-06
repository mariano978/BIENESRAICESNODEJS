/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    extend: {
      boxShadow: {
        highlight: "inset 0 1px 0 0 hsl(0deg 0% 100% / 10%)",
      },
      backgroundImage: {
        gradient:
          "radial-gradient(circle, rgba(15,23,42,1) 20%, rgba(3,66,62,1) 41%, rgba(0,59,71,1) 61%, rgba(15,23,42,1) 80%)",
      },
    },
  },
  plugins: [],
};
