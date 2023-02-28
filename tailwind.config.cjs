/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    extend: {
      boxShadow: {
        highlight: "inset 0 1px 0 0 hsl(0deg 0% 100% / 10%)",
      },
      backgroundImage: {
        'gradient': "linear-gradient(326deg, rgba(15,23,42,1) 42%, rgba(30,41,59,1) 51%, rgba(15,23,42,1) 58%)",
      }
    },
  },
  plugins: [],
};
