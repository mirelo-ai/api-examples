# Quick Start Guide

Get started with the Mirelo AI API in 5 minutes!

## 1. Get Your API Key

Visit [studio.mirelo.ai](https://studio.mirelo.ai) and generate an API key.

## 2. Set Environment Variable

```bash
export MIRELO_API_KEY="your_api_key_here"
```

## 3. Install Dependencies

### Python

```bash
cd examples/python
pip install -r requirements.txt
```

### Node.js

```bash
cd examples/nodejs
npm install
```

## 4. Run Example 1 (No Video Required)

This example generates SFX from text only - perfect for testing!

### Python

```bash
python 1_text_to_sfx.py
```

### Node.js

```bash
npm run example1
```

**What happens:**
- Generates thunder and rain sound effects (5 seconds)
- Creates 2 audio variations
- Downloads results to `output/example1/`

## 5. Run Examples 2 & 3 (Requires Video Files)

For examples 2 and 3, you'll need to provide your own video files:

- **Example 2**: `input_video_short.mp4` (≤10 seconds)
- **Example 3**: `input_video_long.mp4` (>10 seconds, up to 10 minutes)

Place these files in the `python/` or `nodejs/` directory, then run:

### Python

```bash
python 2_short_video_sfx.py   # Example 2
python 3_long_video_sfx.py    # Example 3 (requires FFmpeg)
```

### Node.js

```bash
npm run example2   # Example 2
npm run example3   # Example 3 (requires FFmpeg)
```

## Need Help?

- **API Documentation**: [api.mirelo.ai/docs](https://api.mirelo.ai/docs)
- **Support**: support@mirelo.ai
- **Website**: [mirelo.ai](https://mirelo.ai)

## Tips

### Where to Get Test Videos

- Use your own videos (MP4, WebM, or MOV format)
- Download royalty-free videos from:
  - [Pexels Videos](https://www.pexels.com/videos/)
  - [Pixabay Videos](https://pixabay.com/videos/)
  - [Mixkit](https://mixkit.co/free-stock-video/)

### FFmpeg Installation

Example 3 requires FFmpeg:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Troubleshooting

**"API key not found"**
- Check that `MIRELO_API_KEY` environment variable is set
- Verify the key is correct (no extra spaces)

**"Video file not found"**
- Ensure video files are in the correct directory
- Check the file names match: `input_video_short.mp4` and `input_video_long.mp4`

**"Module not found"**
- Python: Run `pip install -r requirements.txt`
- Node.js: Run `npm install`

