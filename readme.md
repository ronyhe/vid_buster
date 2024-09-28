# Vid Buster
Vid Buster is a Chrome extension that lets you download videos from YouTube and other sites.
Essentially, it's a front-end for [yt-dlp](https://github.com/yt-dlp/yt-dlp).

## Warning
Currently, this extension relies on running a local server and on using the Chrome developer mode.
If you're not aware of the implications, don't use it.
If you'd like to help make it more user-friendly, please feel free to contribute.

## Installation
Pre-requisites:
- python3 (required by yt-dlp)
- node.js (version specified in .nvmrc)
- ffmpeg (optional, but recommended. It enables yt-dlp to give a better experience)

Until https://github.com/jestjs/jest/pull/15288 is merged, you'll also need:
- jq
- sponge

```bash
git clone git@github.com:ronyhe/vid_buster.git
cd vid_buster
npm install
npm run build

# Start the server
npm run start
```

Now you can install `vid_buster/dist/extension` as an [unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

## Development
### Server side
Start the server and restart it on file changes:
```bash
npm run dev:server
```

### Client side
Open a [parcel](https://parceljs.org/) development server:
```bash
npm run dev:client
```

## Disclaimer
I am not a legal or security expert, the project is provided as-is, use at your own risk.

---
> Icon courtesy of https://www.svgrepo.com/svg/421064/evil-monster-viral
>
> As far as I can tell, it's free to use, but I'm not a legal expert. 
> Please correct me if I'm wrong

