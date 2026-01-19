# Media Management Guide

This folder contains all the media assets for your testimonial page. The system automatically loads and displays files from these directories.

## Folder Structure

```
media/
├── main-video/          # Hero section video
├── testimonial-videos/  # Client video testimonials
└── testimonial-screenshots/  # Screenshot testimonials
```

## 1. Main Video (Hero Section)

**Location:** `media/main-video/`

**Filename:** `main.mp4` (or `.webm`, `.mov`)

**Purpose:** This is the main video displayed in the hero section at the top of the page.

**Instructions:**
- Place a single video file named `main.mp4` (or `main.webm`, `main.mov`)
- The video will automatically load and display with a play button
- Recommended aspect ratio: 4:3
- Recommended resolution: 1920x1440 or higher

## 2. Video Testimonials

**Location:** `media/testimonial-videos/`

**Filename Format:** `FirstName-LastName__Job-Title-Company.mp4`

**Examples:**
```
Sarah-Johnson__Marketing-Director.mp4
John-Smith__CEO-TechCorp.mp4
Emily-Davis__Fitness-Enthusiast.mp4
Michael-Brown__Software-Engineer-Google.mp4
```

**Rules:**
- Use double underscores `__` to separate name from designation
- Use single hyphens `-` to separate words within name or designation
- Supported formats: `.mp4`, `.webm`, `.mov`
- The system will automatically:
  - Parse the filename
  - Convert hyphens to spaces (e.g., "Sarah-Johnson" becomes "Sarah Johnson")
  - Display the name and designation under each video
  - Generate video thumbnails

**Recommended Specifications:**
- Aspect ratio: 16:9
- Resolution: 1920x1080 or higher
- Length: 30 seconds to 2 minutes
- File size: Under 50MB for optimal loading

## 3. Screenshot Testimonials

**Location:** `media/testimonial-screenshots/`

**Filename Format:** Any descriptive name (e.g., `testimonial-1.jpg`)

**Examples:**
```
client-review-1.jpg
screenshot-2.png
testimonial-sarah.webp
review-john-smith.jpg
```

**Rules:**
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- Filenames can be anything descriptive
- Images will be displayed in a grid layout
- Click on any image to view it in full-screen lightbox

**Recommended Specifications:**
- Aspect ratio: 3:4 (portrait) or 1:1 (square) works best
- Resolution: At least 800x1200 for portrait images
- File size: Under 2MB for optimal loading
- Screenshots should show: messages, reviews, before/after photos, etc.

## Adding New Media

1. **For Main Video:**
   - Replace the existing `main.mp4` file in `media/main-video/`

2. **For Video Testimonials:**
   - Add new video files to `media/testimonial-videos/`
   - Follow the naming convention: `Name__Designation.mp4`
   - The video will automatically appear on the page

3. **For Screenshots:**
   - Add image files to `media/testimonial-screenshots/`
   - They will automatically display in the grid

## Removing Media

Simply delete the file from its respective folder. The page will automatically update.

## Troubleshooting

**Video not showing:**
- Check the filename format matches the examples
- Ensure the file extension is `.mp4`, `.webm`, or `.mov`
- Verify the file isn't corrupted

**Name parsing issues:**
- Make sure you use double underscores `__` between name and designation
- Use single hyphens `-` for spaces in names

**Screenshots not loading:**
- Verify file extensions are `.jpg`, `.jpeg`, `.png`, or `.webp`
- Check file sizes aren't too large (recommend under 2MB)
