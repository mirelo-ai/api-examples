# Mirelo AI API Examples

This directory contains complete examples for using the Mirelo AI Audio Generation API in both Python and Node.js/TypeScript.

## Prerequisites

- API Key from [studio.mirelo.ai](https://studio.mirelo.ai)
- Python 3.8+ or Node.js 18+
- FFmpeg installed (for video concatenation in example 3)

## Setup

### Python

```bash
cd python
pip install -r requirements.txt
```

### Node.js/TypeScript

```bash
cd nodejs
npm install
```

## Configuration

Set your API key as an environment variable:

```bash
export MIRELO_API_KEY="your_api_key_here"
```

Or replace `process.env.MIRELO_API_KEY` / `os.getenv("MIRELO_API_KEY")` in the code with your actual key.

## Examples

### 1. Text-to-SFX (No Video Required)

Generate sound effects from text descriptions only.

**Python:**
```bash
python python/1_text_to_sfx.py
```

**Node.js:**
```bash
npm run example1
```

**What it does:**
- Generates SFX from text description without any video input
- Uses the `/video-to-sfx` endpoint with `text_prompt` parameter
- Downloads generated audio files

---

### 2. Short Video SFX (≤10 seconds)

Generate sound effects for a short video with full parameter control.

**Python:**
```bash
python python/2_short_video_sfx.py
```

**Node.js:**
```bash
npm run example2
```

**What it does:**
- Uploads a video file (≤10 seconds)
- Generates SFX with custom parameters (duration, creativity, model version)
- Returns video with synchronized audio (set `return_audio_only: false`)
- Downloads the result video

---

### 3. Long Video SFX (>10 seconds, up to 10 minutes)

Generate sound effects for long videos using automatic scene detection.

**Python:**
```bash
python python/3_long_video_sfx.py
```

**Node.js:**
```bash
npm run example3
```

**What it does:**
- Uploads a video file (>10 seconds, up to 10 minutes)
- Uses automatic scene detection to split video into segments
- Generates SFX for each segment (requests 1 sample per scene)
- Downloads audio files for each segment
- Uses FFmpeg to concatenate the selected audio with the original video

---

## API Endpoints Used

### `/create-customer-asset`
Creates an upload URL for your video file.

### `/video-to-sfx`
Generates sound effects for short videos or from text descriptions.

**Key Parameters:**
- `text_prompt` - Text description of desired audio (optional, can be used without video)
- `duration` - Duration in seconds (1-10)
- `num_samples` - Number of variations to generate (1-4)
- `model_version` - Model to use ("1.0" or "1.5")
- `creativity_coef` - Creativity level (1-10)
- `return_audio_only` - Return just audio (true) or video with audio (false)
- `customer_asset_id` - ID from uploaded video (optional)
- `video_url` - Public video URL (optional)

### `/long-video-to-sfx`
Generates sound effects for long videos with automatic scene detection.

**Key Parameters:**
- `num_samples` - Number of audio variations per scene (1-8)
- `customer_asset_id` - ID from uploaded video
- `video_url` - Public video URL (alternative to customer_asset_id)

**Returns:**
Array of video segments with start time, duration, and audio URLs for each segment.

---

## Video Requirements

- **Formats:** MP4, WebM, MOV
- **Max Duration:** 10 seconds for `/video-to-sfx`, 10 minutes for `/long-video-to-sfx`
- **Max File Size:** Depends on your subscription plan

---

## FFmpeg Installation

Example 3 requires FFmpeg for video concatenation.

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

---

## Troubleshooting

### Authentication Errors (401)
- Verify your API key is correct
- Check that the environment variable is set properly

### Video Upload Errors
- Ensure video file exists at the specified path
- Verify video format is supported (MP4, WebM, MOV)
- Check file size limits for your plan

### FFmpeg Errors
- Ensure FFmpeg is installed and in your PATH
- Verify audio/video files are accessible
- Check that file formats are compatible

---

## Support

For questions or issues:
- Visit [mirelo.ai](https://mirelo.ai)
- Email support@mirelo.ai
- View API docs at [api.mirelo.ai/docs](https://api.mirelo.ai/docs)

---

## License

These examples are provided as-is for demonstration purposes.

