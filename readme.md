# Vid Buster
Vid Buster is a Chrome extension that lets you download videos from YouTube and other sites.

## Implementation
Currently, Vid Buster is simply a wrapper around youtube-dl-exec which is a JS wrapper around yt-dlp
(a youtube-dl fork).
It has extremely minimal ui and is not very user-friendly, but it's a start.

## Installation
Pre-requisites:
- Node.js (hopefully via nvm)
- ffmpeg (optional, but recommended)

Steps:
1. Clone this repo
2. Run `npm install`
3. Run `npm run build`
4. Run `npm run start` to start the server. Pass an argument to specify the download destination (defaults to yt-dlp default behavior).
5. Open chrome extensions page (chrome://extensions)
6. Enable developer mode
7. Click "Load unpacked" and select the `dist/extension` folder

## Disclaimer
I am not a legal or security expert, the project is provided as-is, use at your own risk.

## Possible future features
- Better UI
- Better progress reporting
- Tests (Will probably be needed if the codebase grows even slightly)
- Destination selection from ui (maybe file naming too)
