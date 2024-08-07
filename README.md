
# AudioKit: Chrome Equalizer Extension

_Note: We currently support Chromium based browser as this extension uses Manifest V3_

## Overview

AudioKit is a lightweight, open-source Chrome extension that allows users to adjust volume and equalize sound on web pages. It provides an intuitive interface for controlling audio settings and enhancing the listening experience across various websites.

## Main Features

1. **Volume Control**: Adjust the volume of individual tabs with a slider.
2. **Audio Equalization**: 
   - Voice Boost: Enhance voice frequencies for clearer speech.
   - Bass Boost: Amplify low frequencies for richer bass.
3. **Tab-Specific Settings**: Audio settings are saved and applied per tab.
4. **Mute Toggle**: Easily mute/unmute the current tab.
5. **Visual Indicators**: 
   - Display current tab title and audio status.
   - Show whether a tab is muted or audible.
6. **Default Reset**: Quickly reset audio settings to default values.

## Tech Stack

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript
- Chrome Extension APIs
- Web Audio API
- Webpack
- Jest (for testing)

## Setup Instructions

1. Ensure you have [Node.js](https://nodejs.org/en) and npm installed.

2. Clone the repository:
   ```
   git clone https://github.com/ChristianE00/equalizerExtension.git
   cd equalizerExtension
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Build the project:
   ```
   npm run build
   ```
   This command runs Webpack and Tailwind CSS to compile the necessary files.

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the project directory

## Usage

1. Click on the AudioKit icon in the Chrome toolbar to open the popup interface.
2. Use the volume slider to adjust the volume of the current tab.
3. Click "Voice Boost" to enhance voice frequencies or "Bass Boost" for stronger bass.
4. Use the mute toggle to quickly mute or unmute the current tab.
5. Click "Default" to reset all audio settings for the current tab.

## Development

### Running Tests

To run the test suite:

```
npm test
```

### Building for Production

To create a production build:

```
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [ISC License](LICENSE).

## Feedback and Support

For bug reports, feature requests, or general feedback, please [open an issue](https://github.com/ChristianE00/equalizerExtension/issues) on GitHub.

---

Made with ❤️ by the AudioKit team
