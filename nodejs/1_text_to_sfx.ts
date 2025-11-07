#!/usr/bin/env node
/**
 * Example 1: Generate SFX from Text Description Only
 *
 * This example demonstrates how to generate sound effects using only a text description,
 * without any video input. Perfect for creating audio assets from scratch.
 */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// Configuration
const API_KEY = process.env.MIRELO_API_KEY;
const BASE_URL = "https://api.mirelo.ai";
const OUTPUT_DIR = path.join(process.cwd(), "output", "example1");

if (!API_KEY) {
  throw new Error("Please set MIRELO_API_KEY environment variable");
}

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateTextToSfx() {
  console.log("🎵 Generating SFX from text description...");
  console.log("-".repeat(60));

  // Text description of the sound you want to generate
  const textPrompt = "thunder and lightning storm with heavy rain";

  // Request parameters
  const payload = {
    text_prompt: textPrompt,
    duration: 5, // 5 seconds
    num_samples: 2, // Generate 2 variations
    model_version: "1.5" as const, // Use latest model
    creativity_coef: 7, // Higher creativity (1-10)
    return_audio_only: true,
  };

  console.log(`📝 Text prompt: ${textPrompt}`);
  console.log(`⏱️  Duration: ${payload.duration} seconds`);
  console.log(`🎲 Samples: ${payload.num_samples}`);
  console.log(`🎨 Creativity: ${payload.creativity_coef}/10`);
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
    return;
  }

  const result = (await response.json()) as { output_paths: string[] };
  const audioUrls = result.output_paths || [];

  console.log(`✅ Generated ${audioUrls.length} audio variations`);
  console.log();

  // Download generated audio files
  for (let idx = 0; idx < audioUrls.length; idx++) {
    const audioUrl = audioUrls[idx];
    console.log(`📥 Downloading variation ${idx + 1}...`);

    const audioResponse = await fetch(audioUrl);
    if (audioResponse.ok) {
      const audioBuffer = await audioResponse.arrayBuffer();
      const outputPath = path.join(OUTPUT_DIR, `sfx_variation_${idx + 1}.wav`);
      fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
      console.log(`   Saved to: ${outputPath}`);
    } else {
      console.log(`   ❌ Failed to download: ${audioResponse.status}`);
    }
  }

  console.log();
  console.log("=".repeat(60));
  console.log("✨ Done! Check the output directory for your audio files.");
  console.log(`   Location: ${path.resolve(OUTPUT_DIR)}`);
  console.log();
}

// Run the example
generateTextToSfx().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});

