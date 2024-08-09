/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   *  ** - A special part of the glob pattern that matches any number of directories. It 
   *       will look in all subdirectories of src  
   *   * - A wildcard that matches any file name 
  * */
  content: [
    "./src/**/*.js",
    "./*.html"
  ],
  options : {
    safelist: ['text-green-500', 'text-red-500'],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
