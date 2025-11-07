#!/usr/bin/env -S uv run
# /// script
# dependencies = [
#   "requests",
# ]
# ///
"""
Example 2: Generate SFX for Short Video (≤10 seconds)

This example shows how to:
1. Upload a video file (≤10 seconds)
2. Generate SFX with custom parameters
3. Get back a video with synchronized audio
4. Download the result
"""

import os
import requests
from pathlib import Path

# Configuration
API_KEY = os.getenv("MIRELO_API_KEY")
BASE_URL = "https://api.mirelo.ai"
OUTPUT_DIR = Path("output/example2")

# Input video file
INPUT_VIDEO = "example_videos/video_1.mp4"  # Short video (<10 seconds)

if not API_KEY:
    raise ValueError("Please set MIRELO_API_KEY environment variable")

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def upload_video():
    """Upload video and get customer_asset_id"""
    
    print("📤 Step 1: Uploading video...")
    print("-" * 60)
    
    if not Path(INPUT_VIDEO).exists():
        raise FileNotFoundError(f"Video file not found: {INPUT_VIDEO}")
    
    # Step 1: Create customer asset
    print("   Creating upload URL...")
    create_response = requests.post(
        f"{BASE_URL}/create-customer-asset",
        headers={
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        },
        json={"contentType": "video/mp4"}
    )
    
    if create_response.status_code != 200:
        raise Exception(f"Failed to create asset: {create_response.json()}")
    
    create_data = create_response.json()
    customer_asset_id = create_data["customer_asset_id"]
    upload_url = create_data["upload_url"]
    
    print(f"   ✅ Customer Asset ID: {customer_asset_id}")
    
    # Step 2: Upload video file
    print(f"   Uploading {INPUT_VIDEO}...")
    with open(INPUT_VIDEO, "rb") as video_file:
        upload_response = requests.put(
            upload_url,
            data=video_file,
            headers={"Content-Type": "video/mp4"}
        )
    
    if upload_response.status_code not in [200, 204]:
        raise Exception(f"Failed to upload video: {upload_response.status_code}")
    
    print("   ✅ Video uploaded successfully")
    print()
    
    return customer_asset_id

def generate_sfx(customer_asset_id):
    """Generate SFX for the uploaded video"""
    
    print("🎵 Step 2: Generating SFX...")
    print("-" * 60)
    
    # Request parameters
    payload = {
        "customer_asset_id": customer_asset_id,
        "duration": 10,  # Process full 10 seconds (or less if video is shorter)
        "num_samples": 1,  # Generate 1 audio track
        "model_version": "1.5",  # Use latest model
        "creativity_coef": 5,  # Medium creativity (1-10)
        "return_audio_only": False,  # Return video WITH audio mixed in
        "text_prompt": "cinematic sound effects",  # Optional text guidance
        "steps": 25,  # Generation quality (higher = better quality, slower)
    }
    
    print(f"⏱️  Duration: {payload['duration']} seconds")
    print(f"🎬 Return format: Video with audio")
    print(f"🎨 Creativity: {payload['creativity_coef']}/10")
    print(f"📝 Text guidance: {payload['text_prompt']}")
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
        return None
    
    result = response.json()
    output_urls = result.get("output_paths", [])
    
    print(f"✅ Generated {len(output_urls)} output file(s)")
    print()
    
    return output_urls

def download_results(output_urls):
    """Download the generated video files"""
    
    print("📥 Step 3: Downloading results...")
    print("-" * 60)
    
    for idx, video_url in enumerate(output_urls, 1):
        print(f"   Downloading result {idx}...")
        
        video_response = requests.get(video_url)
        if video_response.status_code == 200:
            output_path = OUTPUT_DIR / f"result_video_{idx}.mp4"
            output_path.write_bytes(video_response.content)
            print(f"   ✅ Saved to: {output_path}")
        else:
            print(f"   ❌ Failed to download: {video_response.status_code}")
    
    print()

def main():
    """Main execution flow"""
    
    print("=" * 60)
    print("🎬 Short Video SFX Generation Example")
    print("=" * 60)
    print()
    
    try:
        # Upload video
        customer_asset_id = upload_video()
        
        # Generate SFX
        output_urls = generate_sfx(customer_asset_id)
        
        if output_urls:
            # Download results
            download_results(output_urls)
            
            print("=" * 60)
            print("✨ Done! Check the output directory for your video.")
            print(f"   Location: {OUTPUT_DIR.absolute()}")
            print()
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

