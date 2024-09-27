# Vid Buster
Vid Buster is a Chrome extension that lets you download videos from YouTube and other sites.
Essentially, it's a front-end for [yt-dlp](https://github.com/yt-dlp/yt-dlp).

## Warning
Currently, this extension relies on running a local server and on using the Chrome developer mode.
If you're not aware of the implications, don't use it.
If you'd like to help male it more user-friendly, please feel free to contribute.

## Installation
Pre-requisites:
- python3 (required by yt-dlp)
- node.js (version specified in .nvmrc)
- ffmpeg (optional, but recommended. It enables yt-dlp to give a better experience)

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
- Better progress reporting

---
> Icon courtesy of https://www.svgrepo.com/svg/421064/evil-monster-viral

