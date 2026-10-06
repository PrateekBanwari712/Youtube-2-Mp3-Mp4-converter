const infoBtn = document.getElementById("infoBtn");
const infoBox = document.getElementById("information");
const lookupForm = document.getElementById("lookup-form");
const urlInput = document.getElementById("urlInput");
const downloadInfo = document.getElementById("download-info");
const downloadBtn = document.getElementById("download-btn");
const mediaFormat = document.getElementById("media-format");
const statusBox = document.getElementById("status");
let fetchedUrl = "";

function formatDuration(seconds) {
  const totalSeconds = Number(seconds);
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "Unknown";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`
    : `${minutes}:${paddedSeconds}`;
}

lookupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  infoBtn.disabled = true;
  infoBtn.textContent = "Getting details...";
  infoBox.hidden = true;
  downloadInfo.hidden = true;
  statusBox.textContent = "Fetching video details...";

  try {
    const response = await fetch(
      `http://localhost:3000/api/get-info?url=${encodeURIComponent(url)}`,
    );
    const data = await response.json();
    if (urlInput.value.trim() !== url) return;
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Could not fetch video details.");
    }

    document.querySelector("#title strong").textContent =
      data.title || "Unknown";
    document.querySelector("#duration strong").textContent = formatDuration(
      data.duration,
    );
    document.querySelector("#uploader strong").textContent =
      data.uploader || "Unknown";

    const thumbnail = document.getElementById("info-img");
    thumbnail.src = data.thumbnail || "";
    thumbnail.hidden = !data.thumbnail;

    fetchedUrl = url;
    infoBox.hidden = false;
    downloadInfo.hidden = false;
    infoBtn.hidden = true;
    statusBox.textContent = "Details loaded. Choose a format to download.";
  } catch (error) {
    if (urlInput.value.trim() !== url) return;
    statusBox.textContent =
      error.message || "Unable to connect to the converter server.";
    infoBtn.disabled = false;
    infoBtn.textContent = "Get video details";
  }
});

urlInput.addEventListener("input", () => {
  if (urlInput.value.trim() === fetchedUrl) return;

  fetchedUrl = "";
  infoBox.hidden = true;
  downloadInfo.hidden = true;
  infoBtn.hidden = false;
  infoBtn.disabled = false;
  infoBtn.textContent = "Get video details";
  statusBox.textContent = "";
});

downloadBtn.addEventListener("click", async () => {
  if (!fetchedUrl) return;

  const format = mediaFormat.value;
  const endpoint = format === "mp4" ? "download-video" : "download";
  const downloadUrl = new URL(`http://localhost:3000/api/${endpoint}`);
  downloadUrl.searchParams.set("url", fetchedUrl);
  downloadBtn.disabled = true;
  statusBox.textContent = `Preparing ${format.toUpperCase()} download...`;

  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "The download could not be started.");
    }

    const file = await response.blob();
    const objectUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = objectUrl;
    downloadLink.download =
      format === "mp3" ? "youtube-audio.mp3" : "youtube-video.mp4";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    statusBox.textContent = `${format.toUpperCase()} download started.`;
  } catch (error) {
    statusBox.textContent = error.message || "Unable to download this video.";
  } finally {
    downloadBtn.disabled = false;
  }
});
