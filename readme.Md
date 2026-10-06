# 🎵 YouTube 2 MP3 / MP4 Converter

A lightweight web-based YouTube converter. Enter a YouTube video URL, preview its details, and choose whether to download it as **MP3 audio** or **MP4 video**.

> **Note:** Use this project only for content you own, content in the public domain, or content you have permission to download. Respect YouTube's Terms of Service and applicable copyright laws.

## ✨ Features

- 🔗 Paste a YouTube video URL
- 🔍 Fetch video information before downloading
- 🖼️ Preview the video thumbnail
- 📝 Display video title, duration, and uploader
- 🎵 Download as MP3 audio
- 🎬 Download as MP4 video
- 📱 Responsive, minimal web interface
- ⚡ Simple frontend + backend architecture

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended) and npm
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)

> ⚠️ **Important:** `yt-dlp` and `FFmpeg` must be installed separately on your system and available in your `PATH`. They are external dependencies and are **not bundled** with this application.

Verify they are installed:

```bash
yt-dlp --version
ffmpeg -version
```

## 🏗️ Project Structure

```text
Youtube-2-Mp3-Mp4-converter/
├── backend/
│   ├── ...
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
└── README.md
```

The frontend is a lightweight HTML/CSS/JavaScript interface. The backend is built with Node.js and Express and handles the server-side processing.

## 🛠️ Tech Stack

**Frontend**

- HTML5
- CSS3
- Vanilla JavaScript

**Backend**

- Node.js
- Express.js
- CORS
- Nodemon (development)

**External tools**

- yt-dlp
- FFmpeg

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PrateekBanwari712/Youtube-2-Mp3-Mp4-converter.git
cd Youtube-2-Mp3-Mp4-converter
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Start the backend

Run the backend using the entry file configured in the project:

```bash
node <backend-entry-file>
```

For development, use Nodemon:

```bash
npx nodemon <backend-entry-file>
```

### 4. Run the frontend

Open `frontend/index.html` in your browser, or serve the `frontend` directory with a local static server:

```bash
npx serve frontend
```

## 🔄 How It Works

```text
User
  │  YouTube URL
  ▼
Frontend (HTML / CSS / JS)
  │  Request video information
  ▼
Node.js / Express Backend
  │  Process media with yt-dlp + FFmpeg
  ▼
Conversion / Download
  │
  ▼
MP3 or MP4 file
```

The interface first retrieves video information so the user can verify the selected video. After choosing MP3 or MP4, the backend handles the download/conversion workflow and returns the resulting file.

## 🎯 Why I Built This

I built this project to practice building a complete frontend-to-backend workflow around media processing. It helped me work with:

- REST-style client/server communication
- Express.js backend development
- CORS configuration
- Asynchronous JavaScript
- Handling user input and API responses
- Media download/conversion workflows
- Building a simple, focused user experience

## ⚖️ Legal & Responsible Use

This project is intended for legitimate use only.

Do not use it to download copyrighted material without permission. Users are responsible for complying with YouTube's Terms of Service, copyright laws, and the rights of content creators.

## 🔮 Future Improvements

- [ ] Download progress tracking
- [ ] Selectable video/audio quality
- [ ] API rate limiting
- [ ] Support for more media formats
- [ ] Improved mobile UX
- [ ] Download history
- [ ] Production deployment configuration

## 👤 Author

**Prateek** — [GitHub](https://github.com/PrateekBanwari712)