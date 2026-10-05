// using commonjs to fix the stable environment reaching error
const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());

const YT_REGEX =
  /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;

app.get("/api/get-info", async (req, res) => {
  const { url } = req.query;
  if (!YT_REGEX.test(url || "")) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }
  const yt = spawn("yt-dlp", ["--dump-json", "--no-playlist", url]);

  let rawData = "";
  let errorData = "";

  yt.stdout.on("data", (chunk) => {
    rawData += chunk;
  });

  yt.stderr.on("data", (chunk) => {
    errorData += chunk;
  });

  yt.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp error: ${errorData}`);
      return res.status(500).json({ error: "Failed to fetch video info" });
    }

    try {
      // Parsing the json output from yt-dlp
      const info = JSON.parse(rawData);

      res.status(200).json({
        success: true,
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration, 
        uploader: info.uploader,
        formats: info.formats ? info.formats.length : 0,
      });
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return res.status(500).json({ error: "Failed to parse video metadata" });
    }
  });
  // Handle spawn/path errors (e.g., yt-dlp not found)
  yt.on("error", (err) => {
    console.error("Process error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error spawning yt-dlp" });
    }
  });
});

app.get("/api/download", (req, res) => {
  const { url } = req.query;
  if (!YT_REGEX.test(url || "")) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"');

  const yt = spawn("yt-dlp", [
    "-x", // handles and manages FFmpeg under the hood
    "--audio-format",
    "mp3",
    "--audio-quality",
    "192K",
    "--no-playlist",
    "-o",
    "-",
    url,
  ]);

  // Pipe yt-dlp's output straight to the browser response
  yt.stdout.pipe(res);

  // Logging errors coming from yt-dlp/ffmpeg in terminal
  yt.stderr.on("data", (data) => {
    console.error(`yt-dlp log: ${data.toString()}`);
  });

  yt.on("error", (err) => {
    console.error("Process error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to spawn download process" });
    }
  });

  // Cleaning up the process if user cancels the download
  req.on("close", () => {
    yt.kill();
  });
});

app.get("/api/download-video", (req, res) => {
  const { url } = req.query;
  if (!YT_REGEX.test(url || "")) {
    return res.status(400).json({ error: "" });
  }

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", 'attachment; filename="video.mp4');

  const yt = spawn("yt-dlp", [
    "-f",
    "bv*+ba/b",
    "--no-playlist",
    "-o",
    "-",
    url,
  ]);

  yt.stdout.pipe(res);

  yt.stderr.on("data", (data) => {
    console.log(`yt-dlp error: ${data.toString()}`);
  });

  yt.on("error", (err) => {
    console.error("Process error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to spawn download process" });
    }
  });

  // Cleaning up the process if user cancels the download
  req.on("close", () => {
    yt.kill();
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
