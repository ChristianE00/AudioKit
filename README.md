# AudioKit

A lightweight, open-source web browser extension for adjusting volume and equalizing sound.

### Prerequisites:

Ensure you have [Node.js](https://nodejs.org/en) and npm installed on your system.

### Installation:

First, install the necessary dependencies:

```sh
npm install
```

### Building the Project:

To build the project, use the following command:

```sh
npm run build
```

This command runs Webpack and Tailwind CSS to compile styles from `./src/css/style.css` to `./src/css/output.css`.

### Testing the Project:

To run the tests, use the following command:

```sh
npm test
```

This command executes Jest, which is configured to use the `jsdom` environment for testing.

## Troubleshooting:

- All HTML and CSS files should be in the `/src` directory for Tailwind CSS to properly build the CSS file.

## TODO:

- [x] Voice Boost
- [x] Bass Boost
- [x] 'CLICK ME' redirect link
- [ ] Move lambda expressions to functions
- [x] Audio level not working for embedded videos on Patreon
- [x] Audio booest level 600%
- [x] Have Suggestions box dissapear when the x is clicked.
