// Sample Data for BaskLight Platform
// Copy this data to Firebase Firestore Collections

// ========================================
// MOVIES COLLECTION DATA
// ========================================

const sampleMovies = [
  {
    id: "shahrukh-khan-romance-2024",
    title: "শাহরুখ খানের রোমান্টিক ছবি",
    description: "একটি হৃদয়স্পর্শী প্রেমের গল্প যা আপনাকে কাঁদাবে এবং হাসাবে।",
    thumbnailURL: "./assets/images/movie-thumbnails/shahrukh-khan-romance-2024.jpg",
    videoURL: "./assets/videos/movies/shahrukh-khan-romance-2024.mp4",
    language: "hindi",
    genre: "romance",
    year: 2024,
    duration: "2h 45m",
    category: "featured",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bengali-family-drama-2024",
    title: "বাংলা পারিবারিক নাটক",
    description: "একটি ঐতিহ্যবাহী বাংলা পরিবারের আবেগময় গল্প।",
    thumbnailURL: "./assets/images/movie-thumbnails/bengali-family-drama-2024.jpg",
    videoURL: "./assets/videos/movies/bengali-family-drama-2024.mp4",
    language: "bengali",
    genre: "drama",
    year: 2024,
    duration: "2h 15m",
    category: "trending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bollywood-action-thriller",
    title: "বলিউড অ্যাকশন থ্রিলার",
    description: "রোমাঞ্চকর অ্যাকশন এবং সাসপেন্সে ভরপুর একটি ছবি।",
    thumbnailURL: "./assets/images/movie-thumbnails/bollywood-action-thriller.jpg",
    videoURL: "./assets/videos/movies/bollywood-action-thriller.mp4",
    language: "hindi",
    genre: "action",
    year: 2024,
    duration: "2h 30m",
    category: "new",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bengali-comedy-classic",
    title: "বাংলা কমেডি ক্লাসিক",
    description: "হাসির ছোঁয়ায় ভরপুর একটি চমৎকার বাংলা কমেডি।",
    thumbnailURL: "./assets/images/movie-thumbnails/bengali-comedy-classic.jpg",
    videoURL: "./assets/videos/movies/bengali-comedy-classic.mp4",
    language: "bengali",
    genre: "comedy",
    year: 2023,
    duration: "2h 00m",
    category: "featured",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// ========================================
// SONGS COLLECTION DATA
// ========================================

const sampleSongs = [
  {
    id: "arijit-singh-latest-hit",
    title: "আরিজিৎ সিংয়ের সর্বশেষ হিট",
    artist: "আরিজিৎ সিং",
    album: "লেটেস্ট হিটস ২০২৪",
    thumbnailURL: "./assets/images/song-thumbnails/arijit-singh-latest-hit.jpg",
    audioURL: "./assets/audio/songs/arijit-singh-latest-hit.mp3",
    language: "hindi",
    genre: "bollywood",
    year: 2024,
    duration: "4:30",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "shreya-ghoshal-bengali-song",
    title: "শ্রেয়া ঘোষালের বাংলা গান",
    artist: "শ্রেয়া ঘোষাল",
    album: "বাংলা মেলোডি",
    thumbnailURL: "./assets/images/song-thumbnails/shreya-ghoshal-bengali-song.jpg",
    audioURL: "./assets/audio/songs/shreya-ghoshal-bengali-song.mp3",
    language: "bengali",
    genre: "classical",
    year: 2024,
    duration: "5:15",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "rabindra-sangeet-classic",
    title: "রবীন্দ্র সংগীত ক্লাসিক",
    artist: "বিভিন্ন শিল্পী",
    album: "রবীন্দ্র সংগীত সংকলন",
    thumbnailURL: "./assets/images/song-thumbnails/rabindra-sangeet-classic.jpg",
    audioURL: "./assets/audio/songs/rabindra-sangeet-classic.mp3",
    language: "bengali",
    genre: "classical",
    year: 2024,
    duration: "6:00",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bollywood-dance-number",
    title: "বলিউড ড্যান্স নাম্বার",
    artist: "বিভিন্ন শিল্পী",
    album: "ড্যান্স হিটস",
    thumbnailURL: "./assets/images/song-thumbnails/bollywood-dance-number.jpg",
    audioURL: "./assets/audio/songs/bollywood-dance-number.mp3",
    language: "hindi",
    genre: "bollywood",
    year: 2024,
    duration: "3:45",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bengali-folk-song",
    title: "বাংলা লোকগীতি",
    artist: "লোক শিল্পী",
    album: "বাংলার ঐতিহ্য",
    thumbnailURL: "./assets/images/song-thumbnails/bengali-folk-song.jpg",
    audioURL: "./assets/audio/songs/bengali-folk-song.mp3",
    language: "bengali",
    genre: "folk",
    year: 2024,
    duration: "4:20",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "modern-hindi-remix",
    title: "আধুনিক হিন্দি রিমিক্স",
    artist: "DJ প্রোডিউসার",
    album: "রিমিক্স কালেকশন",
    thumbnailURL: "./assets/images/song-thumbnails/modern-hindi-remix.jpg",
    audioURL: "./assets/audio/songs/modern-hindi-remix.mp3",
    language: "hindi",
    genre: "remix",
    year: 2024,
    duration: "3:30",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// ========================================
// HOW TO ADD DATA TO FIREBASE
// ========================================

/*
Firebase Console এ যাও:
1. https://console.firebase.google.com/project/basklight-bn
2. Firestore Database এ যাও
3. "Start collection" ক্লিক করো
4. Collection ID: "movies" লিখো
5. উপরের sampleMovies array থেকে একটা একটা করে data add করো

একইভাবে "songs" collection তৈরি করে sampleSongs data add করো।

অথবা JavaScript দিয়ে programmatically add করতে পারো:

import { collection, addDoc } from 'firebase/firestore';

// Add movies
sampleMovies.forEach(async (movie) => {
  await addDoc(collection(db, 'movies'), movie);
});

// Add songs  
sampleSongs.forEach(async (song) => {
  await addDoc(collection(db, 'songs'), song);
});
*/

console.log('Sample Movies:', sampleMovies);
console.log('Sample Songs:', sampleSongs);
