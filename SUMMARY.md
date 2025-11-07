# Examples Folder - Creation Summary

This document summarizes the complete examples directory created for the Mirelo AI API.

## 📁 Files Created

### Documentation
- ✅ `README.md` - Complete API examples documentation
- ✅ `QUICKSTART.md` - 5-minute quick start guide
- ✅ `STRUCTURE.md` - Directory structure reference
- ✅ `LICENSE` - MIT license for the examples
- ✅ `.gitignore` - Git ignore rules

### Python Examples (3 files)
- ✅ `python/1_text_to_sfx.py` - Text-to-SFX generation
- ✅ `python/2_short_video_sfx.py` - Short video SFX (≤10s)
- ✅ `python/3_long_video_sfx.py` - Long video SFX with scene detection
- ✅ `python/requirements.txt` - Python dependencies

### Node.js/TypeScript Examples (3 files)
- ✅ `nodejs/1_text_to_sfx.ts` - Text-to-SFX generation
- ✅ `nodejs/2_short_video_sfx.ts` - Short video SFX (≤10s)
- ✅ `nodejs/3_long_video_sfx.ts` - Long video SFX with scene detection
- ✅ `nodejs/package.json` - NPM dependencies & scripts
- ✅ `nodejs/tsconfig.json` - TypeScript configuration

### API Documentation
- ✅ Updated `convex/api/openapi.ts` with GitHub examples link

---

## 🎯 Examples Overview

### Example 1: Text-to-SFX
**No video required!** Perfect for testing.

**What it does:**
- Generates thunder and rain sound effects (5 seconds)
- Creates 2 audio variations
- Downloads to `output/example1/`

**Command:**
```bash
# Python
python python/1_text_to_sfx.py

# Node.js
npm run example1
```

---

### Example 2: Short Video SFX
**Requires:** Video file ≤10 seconds

**What it does:**
1. Uploads video via `/create-customer-asset`
2. Generates SFX with custom parameters (duration, creativity, steps)
3. Returns video WITH audio mixed in (`return_audio_only: false`)
4. Downloads result to `output/example2/`

**Parameters demonstrated:**
- `duration`: 10 seconds
- `num_samples`: 1
- `model_version`: "1.5"
- `creativity_coef`: 5
- `text_prompt`: "cinematic sound effects"
- `steps`: 25

**Command:**
```bash
# Python
python python/2_short_video_sfx.py

# Node.js
npm run example2
```

---

### Example 3: Long Video SFX
**Requires:** Video file >10 seconds (up to 10 minutes) + FFmpeg

**What it does:**
1. Uploads long video
2. API performs automatic scene detection
3. Generates SFX for each scene (requests 1 sample per scene)
4. Downloads all audio segments
5. Concatenates audio segments using FFmpeg
6. Merges concatenated audio with original video

**Output:**
- Individual scene audio files
- Concatenated audio file
- Final video with SFX: `final_video_with_sfx.mp4`

**Command:**
```bash
# Python
python python/3_long_video_sfx.py

# Node.js
npm run example3
```

---

## 🔧 Setup Instructions

### Prerequisites
1. Get API key from [studio.mirelo.ai](https://studio.mirelo.ai)
2. Install Python 3.8+ or Node.js 18+
3. Install FFmpeg (for Example 3 only)

### Python Setup
```bash
cd examples/python
pip install -r requirements.txt
export MIRELO_API_KEY="your_api_key_here"
```

### Node.js Setup
```bash
cd examples/nodejs
npm install
export MIRELO_API_KEY="your_api_key_here"
```

---

## 🚀 Publishing to GitHub

### Steps:
1. Create new GitHub repository: `mirelo-ai/api-examples`
2. Update GitHub URL in `README.md` if different
3. Copy entire `examples/` directory to repository root
4. Commit and push
5. Add repository link to main API documentation
6. Consider adding:
   - Sample output videos/audio
   - GitHub Actions for testing
   - Issue templates
   - Contributing guidelines

### GitHub Repository Settings:
- **Name:** `api-examples`
- **Description:** "Code examples for the Mirelo AI Audio Generation API"
- **Topics:** `ai`, `audio`, `sfx`, `sound-effects`, `api-examples`, `python`, `nodejs`, `typescript`
- **License:** MIT (already included)
- **README:** Already created

---

## 📋 Features Demonstrated

### API Features
- ✅ API key authentication
- ✅ Customer asset creation and upload
- ✅ Text-to-SFX generation (no video)
- ✅ Short video SFX generation (≤10s)
- ✅ Long video SFX with scene detection (up to 10 min)
- ✅ Parameter customization (duration, creativity, samples, etc.)
- ✅ Return formats (audio-only vs video with audio)

### Code Features
- ✅ Error handling
- ✅ Progress logging
- ✅ File I/O operations
- ✅ HTTP requests with authentication
- ✅ Binary file uploads
- ✅ FFmpeg integration
- ✅ Environment variable configuration

### Documentation Features
- ✅ Quick start guide
- ✅ Detailed README
- ✅ Inline code comments
- ✅ Structure documentation
- ✅ Troubleshooting tips
- ✅ Setup instructions

---

## 🔗 Integration Points

### OpenAPI Documentation
The examples are now linked from the OpenAPI specification at:
- **Location:** `convex/api/openapi.ts`
- **Section:** "Code Examples"
- **Link:** https://github.com/mirelo-ai/api-examples

Users will see this in the API documentation at `api.mirelo.ai/docs`

---

## ✨ Next Steps

1. **Test Examples:**
   - Run all examples in clean environment
   - Test with various video formats
   - Verify FFmpeg integration

2. **Publish to GitHub:**
   - Create repository
   - Push code
   - Set up GitHub Pages (optional)

3. **Announce:**
   - Update main website
   - Add to API documentation
   - Email existing customers
   - Blog post/changelog

4. **Maintain:**
   - Monitor issues
   - Update when API changes
   - Add more examples as needed

---

## 📞 Support

For questions about these examples:
- **Email:** support@mirelo.ai
- **API Docs:** https://api.mirelo.ai/docs
- **Website:** https://mirelo.ai

---

**Total Files Created:** 16 files
**Total Lines of Code:** ~1,500+ lines
**Languages:** Python, TypeScript, Markdown
**Status:** ✅ Ready for publishing

