#!/usr/bin/env node

/**
 * Example 3: Generate SFX for Long Video (>10 seconds, up to 10 minutes)
 *
 * This example demonstrates:
 * 1. Uploading a long video (>10 seconds)
 * 2. Using automatic scene detection
 * 3. Generating SFX for each scene (requesting 1 sample per scene)
 * 4. Using FFmpeg to concatenate selected audio with original video
 */

import { execSync } from "child_process";
import fs from "fs";
import fetch from "node-fetch";
import path from "path";

// Configuration
const API_KEY = process.env.MIRELO_API_KEY;
const BASE_URL = "https://api.mirelo.ai";
const OUTPUT_DIR = path.join(process.cwd(), "output", "example3");

// Input video file (you need to provide your own)
const INPUT_VIDEO = "input_video_long.mp4"; // Replace with your video path (>10s)

if (!API_KEY) {
  throw new Error("Please set MIRELO_API_KEY environment variable");
}

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface VideoSegment {
  start: number;
  duration: number;
  audio_urls: string[];
}

interface AudioFile {
  path: string;
  start: number;
  duration: number;
}

function checkFFmpeg(): boolean {
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
    return true;
  } catch {
    console.log("❌ FFmpeg not found. Please install FFmpeg:");
    console.log("   macOS: brew install ffmpeg");
    console.log("   Ubuntu: sudo apt-get install ffmpeg");
    console.log("   Windows: Download from https://ffmpeg.org/download.html");
    return false;
  }
}

async function uploadVideo(): Promise<string> {
  console.log("📤 Step 1: Uploading video...");
  console.log("-".repeat(60));

  if (!fs.existsSync(INPUT_VIDEO)) {
    throw new Error(`Video file not found: ${INPUT_VIDEO}`);
  }

  // Step 1: Create customer asset
  console.log("   Creating upload URL...");
  const createResponse = await fetch(`${BASE_URL}/create-customer-asset`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contentType: "video/mp4" }),
  });

  if (createResponse.status !== 200) {
    throw new Error(`Failed to create asset: ${await createResponse.text()}`);
  }

  const createData = (await createResponse.json()) as {
    customer_asset_id: string;
    upload_url: string;
  };
  const customerAssetId = createData.customer_asset_id;
  const uploadUrl = createData.upload_url;

  console.log(`   ✅ Customer Asset ID: ${customerAssetId}`);

  // Step 2: Upload video file
  console.log(`   Uploading ${INPUT_VIDEO}...`);
  const videoFile = fs.readFileSync(INPUT_VIDEO);
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: videoFile,
    headers: { "Content-Type": "video/mp4" },
  });

  if (uploadResponse.status !== 200 && uploadResponse.status !== 204) {
    throw new Error(`Failed to upload video: ${uploadResponse.status}`);
  }

  console.log("   ✅ Video uploaded successfully");
  console.log();

  return customerAssetId;
}

async function generateLongVideoSfx(
  customerAssetId: string,
): Promise<VideoSegment[] | null> {
  console.log("🎵 Step 2: Generating SFX with scene detection...");
  console.log("-".repeat(60));
  console.log("   This may take a few minutes for longer videos...");
  console.log();

  // Request parameters
  const payload = {
    customer_asset_id: customerAssetId,
    num_samples: 1, // Request 1 audio sample per scene
  };

  console.log(`🎲 Samples per scene: ${payload.num_samples}`);
  console.log();

  // Make API request
  const response = await fetch(`${BASE_URL}/long-video-to-sfx`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 200) {
    console.log(`❌ Error: ${response.status}`);
    console.log(await response.json());
    return null;
  }

  const result = (await response.json()) as {
    video_segments: VideoSegment[];
  };
  const videoSegments = result.video_segments || [];

  console.log(`✅ Generated SFX for ${videoSegments.length} scenes`);
  console.log();

  return videoSegments;
}

async function downloadAudioSegments(
  videoSegments: VideoSegment[],
): Promise<AudioFile[]> {
  console.log("📥 Step 3: Downloading audio segments...");
  console.log("-".repeat(60));

  const audioFiles: AudioFile[] = [];

  for (let idx = 0; idx < videoSegments.length; idx++) {
    const segment = videoSegments[idx];
    const start = segment.start;
    const duration = segment.duration;
    const audioUrls = segment.audio_urls;

    console.log(
      `   Scene ${idx + 1}: ${start.toFixed(2)}s - ${(start + duration).toFixed(2)}s (${duration.toFixed(2)}s)`,
    );

    if (!audioUrls || audioUrls.length === 0) {
      console.log("      ⚠️  No audio generated for this scene");
      continue;
    }

    // Download first audio sample (we requested only 1)
    const audioUrl = audioUrls[0];
    const audioResponse = await fetch(audioUrl);

    if (audioResponse.ok) {
      const audioBuffer = await audioResponse.arrayBuffer();
      const audioPath = path.join(
        OUTPUT_DIR,
        `scene_${String(idx + 1).padStart(3, "0")}.wav`,
      );
      fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
      audioFiles.push({
        path: audioPath,
        start,
        duration,
      });
      console.log(`      ✅ Downloaded: ${path.basename(audioPath)}`);
    } else {
      console.log(`      ❌ Failed to download: ${audioResponse.status}`);
    }
  }

  console.log();
  return audioFiles;
}

function concatenateAudio(audioFiles: AudioFile[]): string | null {
  console.log("🔧 Step 4: Concatenating audio segments...");
  console.log("-".repeat(60));

  if (audioFiles.length === 0) {
    console.log("   ⚠️  No audio files to concatenate");
    return null;
  }

  // Create FFmpeg concat file
  const concatFile = path.join(OUTPUT_DIR, "concat_list.txt");
  const concatContent = audioFiles
    .map((audio) => `file '${path.resolve(audio.path)}'`)
    .join("\n");
  fs.writeFileSync(concatFile, concatContent);

  // Concatenate audio files
  const concatenatedAudio = path.join(OUTPUT_DIR, "concatenated_audio.wav");

  console.log(`   Concatenating ${audioFiles.length} audio segments...`);

  try {
    execSync(
      `ffmpeg -f concat -safe 0 -i "${concatFile}" -c copy -y "${concatenatedAudio}"`,
      { stdio: "pipe" },
    );
    console.log(
      `   ✅ Concatenated audio saved to: ${path.basename(concatenatedAudio)}`,
    );
    console.log();
    return concatenatedAudio;
  } catch (error) {
    console.log("   ❌ FFmpeg error:");
    console.error(error);
    return null;
  }
}

function mergeAudioWithVideo(concatenatedAudio: string): string | null {
  console.log("🎬 Step 5: Merging audio with video...");
  console.log("-".repeat(60));

  const outputVideo = path.join(OUTPUT_DIR, "final_video_with_sfx.mp4");

  console.log(`   Merging audio into ${INPUT_VIDEO}...`);

  try {
    // Replace original audio with generated SFX
    execSync(
      `ffmpeg -i "${INPUT_VIDEO}" -i "${concatenatedAudio}" -map 0:v -map 1:a -c:v copy -c:a aac -shortest -y "${outputVideo}"`,
      { stdio: "pipe" },
    );
    console.log(`   ✅ Final video saved to: ${path.basename(outputVideo)}`);
    console.log();
    return outputVideo;
  } catch (error) {
    console.log("   ❌ FFmpeg error:");
    console.error(error);
    return null;
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("🎬 Long Video SFX Generation Example");
  console.log("=".repeat(60));
  console.log();

  // Check FFmpeg
  if (!checkFFmpeg()) {
    return;
  }

  try {
    // Upload video
    const customerAssetId = await uploadVideo();

    // Generate SFX with scene detection
    const videoSegments = await generateLongVideoSfx(customerAssetId);

    if (!videoSegments) {
      return;
    }

    // Download audio segments
    const audioFiles = await downloadAudioSegments(videoSegments);

    if (audioFiles.length === 0) {
      console.log("⚠️  No audio files downloaded");
      return;
    }

    // Concatenate audio
    const concatenatedAudio = concatenateAudio(audioFiles);

    if (!concatenatedAudio) {
      return;
    }

    // Merge with video
    const finalVideo = mergeAudioWithVideo(concatenatedAudio);

    if (finalVideo) {
      console.log("=".repeat(60));
      console.log("✨ Done! Your video with SFX is ready.");
      console.log(`   Location: ${path.resolve(finalVideo)}`);
      console.log();
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    throw error;
  }
}

// Run the example
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
