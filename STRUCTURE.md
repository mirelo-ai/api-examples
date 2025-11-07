# Examples Directory Structure

This document describes the organization of the Mirelo AI API examples.

## Directory Layout

```
examples/
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick start guide
├── STRUCTURE.md                # This file
├── .gitignore                  # Git ignore rules
│
├── python/                     # Python examples
│   ├── requirements.txt        # Python dependencies
│   ├── 1_text_to_sfx.py       # Example 1: Text-to-SFX
│   ├── 2_short_video_sfx.py   # Example 2: Short video SFX
│   └── 3_long_video_sfx.py    # Example 3: Long video SFX
│
└── nodejs/                     # Node.js/TypeScript examples
    ├── package.json            # NPM dependencies & scripts
    ├── tsconfig.json           # TypeScript configuration
    ├── 1_text_to_sfx.ts       # Example 1: Text-to-SFX
    ├── 2_short_video_sfx.ts   # Example 2: Short video SFX
    └── 3_long_video_sfx.ts    # Example 3: Long video SFX
```

## Example Files

### Example 1: Text-to-SFX
**Files:** `1_text_to_sfx.py`, `1_text_to_sfx.ts`

Generates sound effects from text descriptions without any video input.

**Features:**
- No video required
- Simple one-step process
- Perfect for testing API access
- Demonstrates parameter control (duration, creativity, samples)

**API Endpoints Used:**
- `POST /video-to-sfx`

---

### Example 2: Short Video SFX
**Files:** `2_short_video_sfx.py`, `2_short_video_sfx.ts`

Generates SFX for videos up to 10 seconds with full parameter control.

**Features:**
- Three-step workflow: upload, generate, download
- Returns video with audio mixed in
- Demonstrates all generation parameters
- Shows customer asset upload flow

**API Endpoints Used:**
- `POST /create-customer-asset`
- `POST /video-to-sfx`

**Requirements:**
- Input video file: `input_video_short.mp4` (≤10 seconds)

---

### Example 3: Long Video SFX
**Files:** `3_long_video_sfx.py`, `3_long_video_sfx.ts`

Generates SFX for long videos (up to 10 minutes) using automatic scene detection.

**Features:**
- Automatic scene detection and segmentation
- Generates SFX for each scene independently
- Downloads and concatenates audio segments
- Uses FFmpeg to merge audio with original video
- Demonstrates batch processing

**API Endpoints Used:**
- `POST /create-customer-asset`
- `POST /long-video-to-sfx`

**Requirements:**
- Input video file: `input_video_long.mp4` (>10 seconds, up to 10 minutes)
- FFmpeg installed on system

---

## Dependencies

### Python
- `requests` - HTTP client for API calls

### Node.js/TypeScript
- `node-fetch` - HTTP client for API calls
- `tsx` - TypeScript execution
- `@types/node` - Node.js type definitions
- `typescript` - TypeScript compiler

### System Requirements
- **FFmpeg** (Example 3 only) - Video/audio processing

---

## Output Structure

When examples run, they create output directories:

```
examples/
├── python/
│   └── output/
│       ├── example1/          # Text-to-SFX outputs
│       │   ├── sfx_variation_1.wav
│       │   └── sfx_variation_2.wav
│       ├── example2/          # Short video outputs
│       │   └── result_video_1.mp4
│       └── example3/          # Long video outputs
│           ├── scene_001.wav
│           ├── scene_002.wav
│           ├── concatenated_audio.wav
│           └── final_video_with_sfx.mp4
│
└── nodejs/
    └── output/
        └── (same structure as python)
```

---

## Configuration

All examples require the `MIRELO_API_KEY` environment variable:

```bash
export MIRELO_API_KEY="your_api_key_here"
```

---

## API Integration Points

### Authentication
All requests include `x-api-key` header:
```
x-api-key: your_api_key_here
```

### Base URL
All examples use: `https://api.mirelo.ai`

### Content Types
- Request: `application/json`
- Video upload: `video/mp4`

---

## Publishing Checklist

Before publishing to GitHub:

- [ ] Remove any test API keys from code
- [ ] Add LICENSE file
- [ ] Update GitHub repository URL in README
- [ ] Test all examples in clean environment
- [ ] Verify FFmpeg installation instructions
- [ ] Add sample output files (optional)
- [ ] Create GitHub releases/tags
- [ ] Add repository to API documentation
- [ ] Update main README with examples link

---

## Maintenance Notes

### Updating Examples

When the API changes:
1. Update schema references in code
2. Update parameter descriptions
3. Test all examples end-to-end
4. Update documentation
5. Increment version in package.json

### Common Issues

**Import Errors (Python)**
- Solution: Verify `requirements.txt` includes all dependencies

**Module Resolution (Node.js)**
- Solution: Ensure `"type": "module"` in `package.json`

**FFmpeg Not Found**
- Solution: Add system-specific installation instructions

---

## Support

For questions about these examples:
- Email: support@mirelo.ai
- API Docs: https://api.mirelo.ai/docs
- Website: https://mirelo.ai

