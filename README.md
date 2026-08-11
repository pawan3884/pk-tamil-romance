# PK — Tamil Romance

A small immersive, mobile-first music experience inspired by the cinematic Vercel-hosted bus page you showed.

## What is included
- Full-screen cinematic-style interface
- Your Tamil romantic song list extracted from the screenshots you supplied
- Playlist drawer
- Previous / play-pause / next controls
- YouTube IFrame Player API integration
- Responsive Android/mobile layout
- No MP3 files are bundled

## Important
The first working YouTube ID included is for **Munbe Vaa**. Most other songs intentionally have blank YouTube IDs because a video can change, disappear, or disallow embedding.

To make a song playable inside the site:
1. Find the desired YouTube video.
2. Copy the video ID from its URL (`youtube.com/watch?v=VIDEO_ID`).
3. Open `index.html`.
4. Find that song in `window.PLAYLIST`.
5. Put the ID in its `youtubeId` field.

If a song has no ID, the app opens a YouTube search for it.

YouTube's official IFrame API supports embedding videos and controlling play/pause, seeking and queued videos. Some videos can disallow embedding, so the site cannot guarantee every YouTube upload will work inside the player.

## Deploy to Vercel
The easiest route is:
1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, and `app.js`.
3. Import the repository into Vercel.
4. Deploy.

This is a static site, so you do not need a backend.

## Next version
The visual can be upgraded with:
- a custom AI-generated Tamil-night background
- animated rain
- album-art transitions
- song-specific backgrounds
- lyrics/metadata panel
- swipe gestures
- a "night bus" or "train window" mode
