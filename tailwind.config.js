module.exports = {
    content: ["./pages/**/*.{tsx,ts,js,jsx}", "./components/**/*.{tsx,ts,js,jsx}"],
    theme: {
        extend: {},
    },
    darkMode: "media", // class
    plugins: [require("@tailwindcss/forms")],
};
