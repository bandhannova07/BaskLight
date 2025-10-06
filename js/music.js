import { db, COLLECTIONS } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    query, 
    limit, 
    orderBy, 
    where,
    doc,
    getDoc,
    startAfter
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

class MusicPage {
    constructor() {
        this.songs = [];
        this.filteredSongs = [];
        this.currentPage = 1;
        this.songsPerPage = 16;
        this.lastVisible = null;
        this.currentFilters = {
            language: 'all',
            genre: 'all',
            year: 'all',
            search: ''
        };
        this.currentPlaylist = [];
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSongs();
        this.setupMusicPlayer();
        this.checkURLParams();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('music-search');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.filterSongs();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterSongs();
            });
        }

        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const language = tab.dataset.language;
                this.setLanguageFilter(language);
            });
        });

        // Filter dropdowns
        const genreFilter = document.getElementById('genre-filter');
        const yearFilter = document.getElementById('year-filter');

        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => {
                this.currentFilters.genre = e.target.value;
                this.filterSongs();
            });
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', (e) => {
                this.currentFilters.year = e.target.value;
                this.filterSongs();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreSongs();
            });
        }

        // Modal controls
        const songModal = document.getElementById('song-modal');
        const songModalClose = document.getElementById('song-modal-close');

        if (songModalClose) {
            songModalClose.addEventListener('click', () => {
                this.closeModal('song-modal');
            });
        }

        // Click outside modal to close
        if (songModal) {
            songModal.addEventListener('click', (e) => {
                if (e.target === songModal) {
                    this.closeModal('song-modal');
                }
            });
        }

        // Song action buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'play-btn' || e.target.closest('#play-btn')) {
                this.handlePlaySong();
            }
            if (e.target.id === 'download-song-btn' || e.target.closest('#download-song-btn')) {
                this.handleDownloadSong();
            }
            if (e.target.id === 'favorite-song-btn' || e.target.closest('#favorite-song-btn')) {
                this.handleFavoriteSong();
            }
        });
    }

    setupMusicPlayer() {
        const audioPlayer = document.getElementById('audio-player');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressSlider = document.getElementById('progress-slider');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeBtn = document.getElementById('volume-btn');

        if (!audioPlayer) return;

        // Play/Pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // Previous/Next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.playPrevious();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.playNext();
            });
        }

        // Progress slider
        if (progressSlider) {
            progressSlider.addEventListener('input', (e) => {
                const time = (e.target.value / 100) * audioPlayer.duration;
                audioPlayer.currentTime = time;
            });
        }

        // Volume controls
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                audioPlayer.volume = e.target.value / 100;
                this.updateVolumeIcon(e.target.value);
            });
        }

        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }

        // Audio player events
        audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        audioPlayer.addEventListener('ended', () => {
            this.playNext();
        });

        audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        // Set initial volume
        audioPlayer.volume = 0.7;
    }

    checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const songId = urlParams.get('id');

        if (songId) {
            this.loadSongDetails(songId);
        }
    }

    async loadSongs() {
        const musicGrid = document.getElementById('music-grid');
        if (!musicGrid) return;

        try {
            // Show loading state
            musicGrid.innerHTML = this.createLoadingCards(16);

            const songsRef = collection(db, COLLECTIONS.SONGS);
            let q = query(
                songsRef,
                orderBy('createdAt', 'desc'),
                limit(this.songsPerPage)
            );

            const snapshot = await getDocs(q);
            this.songs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
            this.filteredSongs = [...this.songs];
            this.renderSongs();

        } catch (error) {
            console.error('Error loading songs:', error);
            this.songs = this.getFallbackSongs();
            this.filteredSongs = [...this.songs];
            this.renderSongs();
        }
    }

    async loadMoreSongs() {
        if (!this.lastVisible) return;

        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
        }

        try {
            const songsRef = collection(db, COLLECTIONS.SONGS);
            const q = query(
                songsRef,
                orderBy('createdAt', 'desc'),
                startAfter(this.lastVisible),
                limit(this.songsPerPage)
            );

            const snapshot = await getDocs(q);
            const newSongs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.songs = [...this.songs, ...newSongs];
            this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
            
            this.filterSongs();

        } catch (error) {
            console.error('Error loading more songs:', error);
        } finally {
            if (loadMoreBtn) {
                loadMoreBtn.textContent = 'Load More Songs';
                loadMoreBtn.disabled = false;
            }
        }
    }

    getFallbackSongs() {
        return [
            {
                id: 'song1',
                title: 'Bollywood Hit Song',
                artist: 'Famous Singer',
                album: 'Latest Album',
                thumbnailURL: 'https://via.placeholder.com/300x300?text=Song+1',
                audioURL: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                language: 'hindi',
                genre: 'bollywood',
                year: 2024,
                duration: '4:30'
            },
            {
                id: 'song2',
                title: 'Bengali Classical',
                artist: 'Renowned Artist',
                album: 'Traditional Collection',
                thumbnailURL: 'https://via.placeholder.com/300x300?text=Song+2',
                audioURL: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                language: 'bengali',
                genre: 'classical',
                year: 2024,
                duration: '5:15'
            },
            {
                id: 'song3',
                title: 'Modern Remix',
                artist: 'DJ Producer',
                album: 'Electronic Beats',
                thumbnailURL: 'https://via.placeholder.com/300x300?text=Song+3',
                audioURL: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                language: 'hindi',
                genre: 'remix',
                year: 2023,
                duration: '3:45'
            }
        ];
    }

    setLanguageFilter(language) {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.language === language) {
                tab.classList.add('active');
            }
        });

        this.currentFilters.language = language;
        this.filterSongs();
    }

    filterSongs() {
        this.filteredSongs = this.songs.filter(song => {
            // Language filter
            if (this.currentFilters.language !== 'all' && song.language !== this.currentFilters.language) {
                return false;
            }

            // Genre filter
            if (this.currentFilters.genre !== 'all' && song.genre !== this.currentFilters.genre) {
                return false;
            }

            // Year filter
            if (this.currentFilters.year !== 'all' && song.year.toString() !== this.currentFilters.year) {
                return false;
            }

            // Search filter
            if (this.currentFilters.search && 
                !song.title.toLowerCase().includes(this.currentFilters.search) &&
                !song.artist.toLowerCase().includes(this.currentFilters.search) &&
                !song.album.toLowerCase().includes(this.currentFilters.search)) {
                return false;
            }

            return true;
        });

        this.renderSongs();
    }

    renderSongs() {
        const musicGrid = document.getElementById('music-grid');
        if (!musicGrid) return;

        if (this.filteredSongs.length === 0) {
            musicGrid.innerHTML = '<p class="error-message">No songs found matching your criteria.</p>';
            return;
        }

        const html = this.filteredSongs.map(song => this.createSongCard(song)).join('');
        musicGrid.innerHTML = html;

        // Add click listeners
        this.setupSongCardListeners();
    }

    createSongCard(song) {
        return `
            <div class="song-card" data-id="${song.id}">
                <div class="card-image">
                    <img src="${song.thumbnailURL}" alt="${song.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${song.title}</h3>
                    <div class="card-meta">
                        <span class="meta-item">${song.artist}</span>
                        <span class="meta-item">${song.language}</span>
                        <span class="meta-item">${song.genre}</span>
                        <span class="meta-item">${song.duration}</span>
                    </div>
                </div>
            </div>
        `;
    }

    createLoadingCards(count) {
        return Array(count).fill(0).map(() => `
            <div class="song-card loading">
                <div class="card-image" style="background: #333; animation: pulse 1.5s ease-in-out infinite alternate;">
                    <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%); background-size: 200% 100%; animation: shimmer 2s infinite;"></div>
                </div>
                <div class="card-content">
                    <div style="height: 20px; background: #333; margin-bottom: 10px; border-radius: 4px; animation: pulse 1.5s ease-in-out infinite alternate;"></div>
                    <div style="height: 15px; background: #333; width: 70%; border-radius: 4px; animation: pulse 1.5s ease-in-out infinite alternate;"></div>
                </div>
            </div>
        `).join('');
    }

    setupSongCardListeners() {
        const songCards = document.querySelectorAll('.song-card[data-id]');
        songCards.forEach(card => {
            card.addEventListener('click', () => {
                const songId = card.dataset.id;
                this.showSongModal(songId);
            });
        });
    }

    showSongModal(songId) {
        const song = this.filteredSongs.find(s => s.id === songId);
        if (!song) return;

        // Update modal content
        document.getElementById('modal-song-artwork').src = song.thumbnailURL;
        document.getElementById('modal-song-title').textContent = song.title;
        document.getElementById('modal-song-artist').textContent = song.artist;
        document.getElementById('modal-song-album').textContent = song.album;
        document.getElementById('modal-song-year').textContent = song.year;
        document.getElementById('modal-song-language').textContent = song.language;

        // Store current song for actions
        this.currentSong = song;

        // Show/hide login prompt based on auth status
        const loginPrompt = document.getElementById('login-prompt');
        const songActions = document.querySelector('.song-actions');
        
        if (window.authManager && window.authManager.isLoggedIn()) {
            loginPrompt.classList.add('hidden');
            songActions.style.display = 'flex';
        } else {
            loginPrompt.classList.remove('hidden');
            songActions.style.display = 'none';
        }

        // Show modal
        this.openModal('song-modal');
    }

    async loadSongDetails(songId) {
        try {
            const songRef = doc(db, COLLECTIONS.SONGS, songId);
            const songDoc = await getDoc(songRef);
            
            if (songDoc.exists()) {
                const song = { id: songDoc.id, ...songDoc.data() };
                this.showSongModal(songId);
            }
        } catch (error) {
            console.error('Error loading song details:', error);
        }
    }

    handlePlaySong() {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            window.authManager.openModal('login');
            return;
        }

        if (!this.currentSong) return;

        this.closeModal('song-modal');
        this.playSong(this.currentSong);
    }

    handleDownloadSong() {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            window.authManager.openModal('login');
            return;
        }

        if (!this.currentSong) return;

        // Create download link
        const link = document.createElement('a');
        link.href = this.currentSong.audioURL;
        link.download = `${this.currentSong.title} - ${this.currentSong.artist}.mp3`;
        link.click();
    }

    handleFavoriteSong() {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            window.authManager.openModal('login');
            return;
        }

        // Toggle favorite status (implement with Firestore)
        const favoriteBtn = document.getElementById('favorite-song-btn');
        const icon = favoriteBtn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            favoriteBtn.classList.add('active');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            favoriteBtn.classList.remove('active');
        }
    }

    playSong(song) {
        const audioPlayer = document.getElementById('audio-player');
        const musicPlayerBar = document.getElementById('music-player-bar');
        const playerThumbnail = document.getElementById('player-thumbnail');
        const playerTitle = document.getElementById('player-title');
        const playerArtist = document.getElementById('player-artist');

        if (!audioPlayer) return;

        // Update player info
        playerThumbnail.src = song.thumbnailURL;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;

        // Set audio source and play
        audioPlayer.src = song.audioURL;
        audioPlayer.play();

        // Show player bar
        musicPlayerBar.classList.add('active');

        // Update play button
        this.updatePlayButton(true);
        this.isPlaying = true;

        // Set current playlist
        this.currentPlaylist = this.filteredSongs;
        this.currentSongIndex = this.currentPlaylist.findIndex(s => s.id === song.id);
    }

    togglePlayPause() {
        const audioPlayer = document.getElementById('audio-player');
        
        if (this.isPlaying) {
            audioPlayer.pause();
            this.updatePlayButton(false);
            this.isPlaying = false;
        } else {
            audioPlayer.play();
            this.updatePlayButton(true);
            this.isPlaying = true;
        }
    }

    playPrevious() {
        if (this.currentPlaylist.length === 0) return;
        
        this.currentSongIndex = (this.currentSongIndex - 1 + this.currentPlaylist.length) % this.currentPlaylist.length;
        this.playSong(this.currentPlaylist[this.currentSongIndex]);
    }

    playNext() {
        if (this.currentPlaylist.length === 0) return;
        
        this.currentSongIndex = (this.currentSongIndex + 1) % this.currentPlaylist.length;
        this.playSong(this.currentPlaylist[this.currentSongIndex]);
    }

    updatePlayButton(isPlaying) {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const icon = playPauseBtn.querySelector('i');
        
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }

    updateProgress() {
        const audioPlayer = document.getElementById('audio-player');
        const progressFill = document.getElementById('progress-fill');
        const progressSlider = document.getElementById('progress-slider');
        const timeCurrent = document.getElementById('time-current');

        if (!audioPlayer.duration) return;

        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = progress + '%';
        progressSlider.value = progress;

        timeCurrent.textContent = this.formatTime(audioPlayer.currentTime);
    }

    updateDuration() {
        const audioPlayer = document.getElementById('audio-player');
        const timeTotal = document.getElementById('time-total');

        timeTotal.textContent = this.formatTime(audioPlayer.duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    toggleMute() {
        const audioPlayer = document.getElementById('audio-player');
        const volumeSlider = document.getElementById('volume-slider');
        
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            volumeSlider.value = audioPlayer.volume * 100;
            this.updateVolumeIcon(volumeSlider.value);
        } else {
            audioPlayer.muted = true;
            this.updateVolumeIcon(0);
        }
    }

    updateVolumeIcon(volume) {
        const volumeBtn = document.getElementById('volume-btn');
        const icon = volumeBtn.querySelector('i');
        
        icon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-mute');
        
        if (volume == 0) {
            icon.classList.add('fa-volume-mute');
        } else if (volume < 50) {
            icon.classList.add('fa-volume-down');
        } else {
            icon.classList.add('fa-volume-up');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    }
}

// Initialize the music page
document.addEventListener('DOMContentLoaded', () => {
    new MusicPage();
});
