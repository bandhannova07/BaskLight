// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDd4gmF9-zSkt9AafY4n4s3fy1R9154rfM",
    authDomain: "basklight-bn.firebaseapp.com",
    projectId: "basklight-bn",
    storageBucket: "basklight-bn.firebasestorage.app",
    messagingSenderId: "358615448463",
    appId: "1:358615448463:web:3cd556b49ee2429395a9fa",
    measurementId: "G-CEFG4VEHKG"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore Collections Structure
export const COLLECTIONS = {
    MOVIES: 'movies',
    SONGS: 'songs', 
    USERS: 'users',
    ADS: 'ads'
};

// Sample data structure for reference
export const SAMPLE_DATA = {
    movie: {
        id: 'movie_id',
        title: 'Movie Title',
        description: 'Movie description',
        thumbnailURL: 'https://example.com/thumbnail.jpg',
        videoURL: 'https://example.com/video.mp4',
        language: 'hindi', // 'hindi' or 'bengali'
        genre: 'action', // 'action', 'drama', 'comedy', etc.
        year: 2024,
        duration: '2h 30m',
        category: 'featured', // 'featured', 'trending', 'new'
        adURL: 'https://example.com/ad.mp4',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    song: {
        id: 'song_id',
        title: 'Song Title',
        artist: 'Artist Name',
        album: 'Album Name',
        thumbnailURL: 'https://example.com/artwork.jpg',
        audioURL: 'https://example.com/song.mp3',
        language: 'hindi', // 'hindi' or 'bengali'
        genre: 'bollywood', // 'bollywood', 'classical', 'folk', etc.
        year: 2024,
        duration: '4:30',
        adURL: 'https://example.com/ad.mp3',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    user: {
        uid: 'user_uid',
        name: 'User Name',
        email: 'user@example.com',
        photoURL: 'https://example.com/avatar.jpg',
        joinedOn: new Date(),
        favoriteMovies: [], // Array of movie IDs
        favoriteSongs: [], // Array of song IDs
        watchlist: [], // Array of movie/song IDs
        downloads: [], // Array of downloaded content IDs
        preferences: {
            autoPlay: true,
            notifications: true,
            darkMode: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    ad: {
        id: 'ad_id',
        adURL: 'https://example.com/ad.mp4',
        duration: 15, // seconds
        type: 'video', // 'video' or 'audio'
        skipAfter: 5, // seconds
        createdAt: new Date()
    }
};

console.log('Firebase initialized successfully');
