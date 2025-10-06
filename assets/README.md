# 📁 BaskLight Assets Folder Structure

এই folder এ তুমি তোমার সব media files organize করতে পারবে।

## 📂 Folder Structure

```
assets/
├── images/
│   ├── movie-thumbnails/     # Movie poster images
│   └── song-thumbnails/      # Song artwork images
├── videos/
│   ├── movies/              # Movie video files
│   └── songs/               # Song video files (music videos)
└── audio/
    └── songs/               # Song audio files (extracted MP3)
```

## 🎬 Movie Files

### Movie Thumbnails (`assets/images/movie-thumbnails/`)
- **Format**: JPG, PNG, WebP
- **Size**: 300x400px (poster ratio)
- **Naming**: `movie-id.jpg` (example: `hindi-movie-1.jpg`)
- **Examples**:
  - `bollywood-blockbuster-2024.jpg`
  - `bengali-classic-drama.jpg`
  - `action-thriller-hindi.jpg`

### Movie Videos (`assets/videos/movies/`)
- **Format**: MP4, WebM
- **Quality**: 720p, 1080p
- **Naming**: `movie-id.mp4` (example: `hindi-movie-1.mp4`)
- **Examples**:
  - `bollywood-blockbuster-2024.mp4`
  - `bengali-classic-drama.mp4`
  - `action-thriller-hindi.mp4`

## 🎵 Music Files

### Song Thumbnails (`assets/images/song-thumbnails/`)
- **Format**: JPG, PNG, WebP
- **Size**: 300x300px (square ratio)
- **Naming**: `song-id.jpg` (example: `hindi-song-1.jpg`)
- **Examples**:
  - `bollywood-hit-2024.jpg`
  - `rabindra-sangeet-classic.jpg`
  - `bengali-folk-song.jpg`

### Song Videos (`assets/videos/songs/`)
- **Format**: MP4, WebM
- **Quality**: 720p, 1080p
- **Naming**: `song-id.mp4` (example: `hindi-song-1.mp4`)
- **Examples**:
  - `bollywood-hit-2024.mp4` (music video)
  - `rabindra-sangeet-classic.mp4` (music video)
  - `bengali-folk-song.mp4` (music video)

### Song Audio (`assets/audio/songs/`)
- **Format**: MP3, WAV, OGG
- **Quality**: 128kbps, 320kbps
- **Naming**: `song-id.mp3` (example: `hindi-song-1.mp3`)
- **Examples**:
  - `bollywood-hit-2024.mp3` (audio only)
  - `rabindra-sangeet-classic.mp3` (audio only)
  - `bengali-folk-song.mp3` (audio only)

## 🔗 Firebase এ কিভাবে Reference করবে

### Movies Collection এ:
```javascript
{
  id: "bollywood-blockbuster-2024",
  title: "Bollywood Blockbuster",
  thumbnailURL: "./assets/images/movie-thumbnails/bollywood-blockbuster-2024.jpg",
  videoURL: "./assets/videos/movies/bollywood-blockbuster-2024.mp4",
  // ... other fields
}
```

### Songs Collection এ:
```javascript
{
  id: "bollywood-hit-2024",
  title: "Bollywood Hit Song",
  thumbnailURL: "./assets/images/song-thumbnails/bollywood-hit-2024.jpg",
  videoURL: "./assets/videos/songs/bollywood-hit-2024.mp4", // Music video
  audioURL: "./assets/audio/songs/bollywood-hit-2024.mp3", // Audio only
  hasVideo: true, // Video version available
  hasAudio: true, // Audio version available
  // ... other fields
}
```

## 📝 File Upload Guidelines

### 1. **Movie Thumbnails**
- Upload করো: `assets/images/movie-thumbnails/`
- File size: Max 500KB
- Aspect ratio: 3:4 (portrait)

### 2. **Song Thumbnails**
- Upload করো: `assets/images/song-thumbnails/`
- File size: Max 300KB
- Aspect ratio: 1:1 (square)

### 3. **Movie Videos**
- Upload করো: `assets/videos/movies/`
- File size: Max 500MB (for demo)
- Format: MP4 preferred

### 4. **Song Audio**
- Upload করো: `assets/audio/songs/`
- File size: Max 10MB
- Format: MP3 preferred

## 🚀 Production এ Firebase Storage ব্যবহার

Production এ তুমি Firebase Storage ব্যবহার করতে পারো:

```javascript
// Upload to Firebase Storage
const storageRef = ref(storage, 'movies/bollywood-blockbuster-2024.mp4');
const uploadTask = uploadBytes(storageRef, file);

// Get download URL
const downloadURL = await getDownloadURL(storageRef);
```

## 📋 Sample File Names

### Movies:
- `shahrukh-khan-romance-2024.jpg` (thumbnail)
- `shahrukh-khan-romance-2024.mp4` (video)
- `bengali-family-drama.jpg` (thumbnail)
- `bengali-family-drama.mp4` (video)

### Songs:
- `arijit-singh-latest-hit.jpg` (thumbnail)
- `arijit-singh-latest-hit.mp3` (audio)
- `shreya-ghoshal-bengali.jpg` (thumbnail)
- `shreya-ghoshal-bengali.mp3` (audio)

এই structure follow করলে তোমার সব files organized থাকবে এবং easily manage করতে পারবে! 🎬🎵
