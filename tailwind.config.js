/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   *  ** - A special part of the glob pattern that matches any number of directories. It 
   *       will look in all subdirectories of src  
   *   * - A wildcard that matches any file name 
  * */
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}