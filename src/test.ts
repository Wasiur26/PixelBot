import path from "path";
import { exec } from "youtube-dl-exec";

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const output = path.resolve(__dirname, "output.mp3");

async function download() {
  console.log("🚀 Starting download with yt-dlp...");
  try {
    await exec(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: output,
      // yt-dlp automatically handles the PoToken/Bot detection
    });
    console.log("✅ Finished! Check output.mp3");
  } catch (e) {
    console.error("❌ Failed:", e);
  }
}

void download();
