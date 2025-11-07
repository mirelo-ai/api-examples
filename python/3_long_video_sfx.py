#!/usr/bin/env python3
"""
Example 3: Generate SFX for Long Video (>10 seconds, up to 10 minutes)

This example demonstrates:
1. Uploading a long video (>10 seconds)
2. Using automatic scene detection
3. Generating SFX for each scene (requesting 1 sample per scene)
4. Using FFmpeg to concatenate selected audio with original video
"""

import os
import subprocess
import requests
from pathlib import Path

# Configuration
API_KEY = os.getenv("MIRELO_API_KEY")
BASE_URL = "https://api.mirelo.ai"
OUTPUT_DIR = Path("output/example3")

# Input video file (you need to provide your own)
INPUT_VIDEO = "input_video_long.mp4"  # Replace with your video path (>10s)

if not API_KEY:
    raise ValueError("Please set MIRELO_API_KEY environment variable")

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    try:
        subprocess.run(
            ["ffmpeg", "-version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ FFmpeg not found. Please install FFmpeg:")
        print("   macOS: brew install ffmpeg")
        print("   Ubuntu: sudo apt-get install ffmpeg")
        print("   Windows: Download from https://ffmpeg.org/download.html")
        return False

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

def generate_long_video_sfx(customer_asset_id):
    """Generate SFX for long video with scene detection"""
    
    print("🎵 Step 2: Generating SFX with scene detection...")
    print("-" * 60)
    print("   This may take a few minutes for longer videos...")
    print()
    
    # Request parameters
    payload = {
        "customer_asset_id": customer_asset_id,
        "num_samples": 1,  # Request 1 audio sample per scene
    }
    
    print(f"🎲 Samples per scene: {payload['num_samples']}")
    print()
    
    # Make API request
    response = requests.post(
        f"{BASE_URL}/long-video-to-sfx",
        headers={
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        },
        json=payload
    )
    
    if response.status_code != 200:
        print(f"❌ Error: {response.status_code}")
        print(response.json())
        return None
    
    result = response.json()
    video_segments = result.get("video_segments", [])
    
    print(f"✅ Generated SFX for {len(video_segments)} scenes")
    print()
    
    return video_segments

def download_audio_segments(video_segments):
    """Download audio files for each segment"""
    
    print("📥 Step 3: Downloading audio segments...")
    print("-" * 60)
    
    audio_files = []
    
    for idx, segment in enumerate(video_segments, 1):
        start = segment["start"]
        duration = segment["duration"]
        audio_urls = segment["audio_urls"]
        
        print(f"   Scene {idx}: {start:.2f}s - {start + duration:.2f}s ({duration:.2f}s)")
        
        if not audio_urls:
            print(f"      ⚠️  No audio generated for this scene")
            continue
        
        # Download first audio sample (we requested only 1)
        audio_url = audio_urls[0]
        audio_response = requests.get(audio_url)
        
        if audio_response.status_code == 200:
            audio_path = OUTPUT_DIR / f"scene_{idx:03d}.wav"
            audio_path.write_bytes(audio_response.content)
            audio_files.append({
                "path": audio_path,
                "start": start,
                "duration": duration
            })
            print(f"      ✅ Downloaded: {audio_path.name}")
        else:
            print(f"      ❌ Failed to download: {audio_response.status_code}")
    
    print()
    return audio_files

def concatenate_audio(audio_files):
    """Concatenate audio segments using FFmpeg"""
    
    print("🔧 Step 4: Concatenating audio segments...")
    print("-" * 60)
    
    if not audio_files:
        print("   ⚠️  No audio files to concatenate")
        return None
    
    # Create FFmpeg concat file
    concat_file = OUTPUT_DIR / "concat_list.txt"
    with open(concat_file, "w") as f:
        for audio_file in audio_files:
            # FFmpeg concat format: file 'path'
            f.write(f"file '{audio_file['path'].absolute()}'\n")
    
    # Concatenate audio files
    concatenated_audio = OUTPUT_DIR / "concatenated_audio.wav"
    
    print(f"   Concatenating {len(audio_files)} audio segments...")
    
    result = subprocess.run(
        [
            "ffmpeg",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-c", "copy",
            "-y",
            str(concatenated_audio)
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    if result.returncode != 0:
        print("   ❌ FFmpeg error:")
        print(result.stderr.decode())
        return None
    
    print(f"   ✅ Concatenated audio saved to: {concatenated_audio.name}")
    print()
    
    return concatenated_audio

def merge_audio_with_video(concatenated_audio):
    """Merge concatenated audio with original video"""
    
    print("🎬 Step 5: Merging audio with video...")
    print("-" * 60)
    
    output_video = OUTPUT_DIR / "final_video_with_sfx.mp4"
    
    print(f"   Merging audio into {INPUT_VIDEO}...")
    
    # Replace original audio with generated SFX
    result = subprocess.run(
        [
            "ffmpeg",
            "-i", INPUT_VIDEO,
            "-i", str(concatenated_audio),
            "-map", "0:v",  # Use video from first input
            "-map", "1:a",  # Use audio from second input
            "-c:v", "copy",  # Copy video codec (no re-encoding)
            "-c:a", "aac",   # Encode audio to AAC
            "-shortest",     # End when shortest stream ends
            "-y",
            str(output_video)
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    if result.returncode != 0:
        print("   ❌ FFmpeg error:")
        print(result.stderr.decode())
        return None
    
    print(f"   ✅ Final video saved to: {output_video.name}")
    print()
    
    return output_video

def main():
    """Main execution flow"""
    
    print("=" * 60)
    print("🎬 Long Video SFX Generation Example")
    print("=" * 60)
    print()
    
    # Check FFmpeg
    if not check_ffmpeg():
        return
    
    try:
        # Upload video
        customer_asset_id = upload_video()
        
        # Generate SFX with scene detection
        video_segments = generate_long_video_sfx(customer_asset_id)
        
        if not video_segments:
            return
        
        # Download audio segments
        audio_files = download_audio_segments(video_segments)
        
        if not audio_files:
            print("⚠️  No audio files downloaded")
            return
        
        # Concatenate audio
        concatenated_audio = concatenate_audio(audio_files)
        
        if not concatenated_audio:
            return
        
        # Merge with video
        final_video = merge_audio_with_video(concatenated_audio)
        
        if final_video:
            print("=" * 60)
            print("✨ Done! Your video with SFX is ready.")
            print(f"   Location: {final_video.absolute()}")
            print()
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

