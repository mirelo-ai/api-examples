#!/usr/bin/env python3
"""
Example 1: Generate SFX from Text Description Only

This example demonstrates how to generate sound effects using only a text description,
without any video input. Perfect for creating audio assets from scratch.
"""

import os
import requests
from pathlib import Path

# Configuration
API_KEY = os.getenv("MIRELO_API_KEY")
BASE_URL = "https://api.mirelo.ai"
OUTPUT_DIR = Path("output/example1")

if not API_KEY:
    raise ValueError("Please set MIRELO_API_KEY environment variable")

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_text_to_sfx():
    """Generate SFX from text description without video"""
    
    print("🎵 Generating SFX from text description...")
    print("-" * 60)
    
    # Text description of the sound you want to generate
    text_prompt = "thunder and lightning storm with heavy rain"
    
    # Request parameters
    payload = {
        "text_prompt": text_prompt,
        "duration": 5,  # 5 seconds
        "num_samples": 2,  # Generate 2 variations
        "model_version": "1.5",  # Use latest model
        "creativity_coef": 7,  # Higher creativity (1-10)
        "return_audio_only": True,
    }
    
    print(f"📝 Text prompt: {text_prompt}")
    print(f"⏱️  Duration: {payload['duration']} seconds")
    print(f"🎲 Samples: {payload['num_samples']}")
    print(f"🎨 Creativity: {payload['creativity_coef']}/10")
    print()
    
    # Make API request
    response = requests.post(
        f"{BASE_URL}/video-to-sfx",
        headers={
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        },
        json=payload
    )
    
    if response.status_code != 201:
        print(f"❌ Error: {response.status_code}")
        print(response.json())
        return
    
    result = response.json()
    audio_urls = result.get("output_paths", [])
    
    print(f"✅ Generated {len(audio_urls)} audio variations")
    print()
    
    # Download generated audio files
    for idx, audio_url in enumerate(audio_urls, 1):
        print(f"📥 Downloading variation {idx}...")
        
        audio_response = requests.get(audio_url)
        if audio_response.status_code == 200:
            output_path = OUTPUT_DIR / f"sfx_variation_{idx}.wav"
            output_path.write_bytes(audio_response.content)
            print(f"   Saved to: {output_path}")
        else:
            print(f"   ❌ Failed to download: {audio_response.status_code}")
    
    print()
    print("=" * 60)
    print("✨ Done! Check the output directory for your audio files.")
    print(f"   Location: {OUTPUT_DIR.absolute()}")
    print()

if __name__ == "__main__":
    generate_text_to_sfx()

