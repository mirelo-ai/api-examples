#!/usr/bin/env node
/**
 * Example 2: Generate SFX for Short Video (≤10 seconds)
 *
 * This example shows how to:
 * 1. Upload a video file (≤10 seconds)
 * 2. Generate SFX with custom parameters
 * 3. Get back a video with synchronized audio
 * 4. Download the result
 */

import fs from "fs";
import fetch from "node-fetch";
import path from "path";

// Configuration
const API_KEY = process.env.MIRELO_API_KEY;
const BASE_URL = "https://api.mirelo.ai";
const OUTPUT_DIR = path.join(process.cwd(), "output", "example2");

// Input video file (you need to provide your own)
const INPUT_VIDEO = "input_video_short.mp4"; // Replace with your video path

if (!API_KEY) {
  throw new Error("Please set MIRELO_API_KEY environment variable");
}

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

async function generateSfx(customerAssetId: string): Promise<string[] | null> {
  console.log("🎵 Step 2: Generating SFX...");
  console.log("-".repeat(60));

  // Request parameters
  const payload = {
    customer_asset_id: customerAssetId,
    duration: 10, // Process full 10 seconds (or less if video is shorter)
    num_samples: 1, // Generate 1 audio track
    model_version: "1.5" as const, // Use latest model
    creativity_coef: 5, // Medium creativity (1-10)
    return_audio_only: false, // Return video WITH audio mixed in
    text_prompt: "cinematic sound effects", // Optional text guidance
    steps: 25, // Generation quality (higher = better quality, slower)
  };

  console.log(`⏱️  Duration: ${payload.duration} seconds`);
  console.log(`🎬 Return format: Video with audio`);
  console.log(`🎨 Creativity: ${payload.creativity_coef}/10`);
  console.log(`📝 Text guidance: ${payload.text_prompt}`);
  console.log();

  // Make API request
  const response = await fetch(`${BASE_URL}/video-to-sfx`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 201) {
    console.log(`❌ Error: ${response.status}`);
    console.log(await response.json());
    return null;
  }

  const result = (await response.json()) as { output_paths: string[] };
  const outputUrls = result.output_paths || [];

  console.log(`✅ Generated ${outputUrls.length} output file(s)`);
  console.log();

  return outputUrls;
}

async function downloadResults(outputUrls: string[]): Promise<void> {
  console.log("📥 Step 3: Downloading results...");
  console.log("-".repeat(60));

  for (let idx = 0; idx < outputUrls.length; idx++) {
    const videoUrl = outputUrls[idx];
    console.log(`   Downloading result ${idx + 1}...`);

    const videoResponse = await fetch(videoUrl);
    if (videoResponse.ok) {
      const videoBuffer = await videoResponse.arrayBuffer();
      const outputPath = path.join(OUTPUT_DIR, `result_video_${idx + 1}.mp4`);
      fs.writeFileSync(outputPath, Buffer.from(videoBuffer));
      console.log(`   ✅ Saved to: ${outputPath}`);
    } else {
      console.log(`   ❌ Failed to download: ${videoResponse.status}`);
    }
  }

  console.log();
}

async function main() {
  console.log("=".repeat(60));
  console.log("🎬 Short Video SFX Generation Example");
  console.log("=".repeat(60));
  console.log();

  try {
    // Upload video
    const customerAssetId = await uploadVideo();

    // Generate SFX
    const outputUrls = await generateSfx(customerAssetId);

    if (outputUrls) {
      // Download results
      await downloadResults(outputUrls);

      console.log("=".repeat(60));
      console.log("✨ Done! Check the output directory for your video.");
      console.log(`   Location: ${path.resolve(OUTPUT_DIR)}`);
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
