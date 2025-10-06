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

class MoviesPage {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.currentPage = 1;
        this.moviesPerPage = 12;
        this.lastVisible = null;
        this.currentFilters = {
            language: 'all',
            genre: 'all',
            year: 'all',
            search: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMovies();
        this.checkURLParams();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('movie-search');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.filterMovies();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterMovies();
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
                this.filterMovies();
            });
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', (e) => {
                this.currentFilters.year = e.target.value;
                this.filterMovies();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreMovies();
            });
        }

        // Modal controls
        const movieModal = document.getElementById('movie-modal');
        const movieModalClose = document.getElementById('movie-modal-close');
        const videoModal = document.getElementById('video-modal');
        const videoModalClose = document.getElementById('video-modal-close');

        if (movieModalClose) {
            movieModalClose.addEventListener('click', () => {
                this.closeModal('movie-modal');
            });
        }

        if (videoModalClose) {
            videoModalClose.addEventListener('click', () => {
                this.closeModal('video-modal');
                this.stopVideo();
            });
        }

        // Click outside modal to close
        if (movieModal) {
            movieModal.addEventListener('click', (e) => {
                if (e.target === movieModal) {
                    this.closeModal('movie-modal');
                }
            });
        }

        if (videoModal) {
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    this.closeModal('video-modal');
                    this.stopVideo();
                }
            });
        }

        // Movie action buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'watch-btn' || e.target.closest('#watch-btn')) {
                this.handleWatchMovie();
            }
            if (e.target.id === 'download-btn' || e.target.closest('#download-btn')) {
                this.handleDownloadMovie();
            }
            if (e.target.id === 'favorite-btn' || e.target.closest('#favorite-btn')) {
                this.handleFavoriteMovie();
            }
        });
    }

    checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        const filter = urlParams.get('filter');

        if (movieId) {
            this.loadMovieDetails(movieId);
        }

        if (filter) {
            // Apply filter from URL
            switch (filter) {
                case 'trending':
                    this.currentFilters.category = 'trending';
                    break;
                case 'new':
                    this.currentFilters.category = 'new';
                    break;
            }
        }
    }

    async loadMovies() {
        const moviesGrid = document.getElementById('movies-grid');
        if (!moviesGrid) return;

        try {
            // Show loading state
            moviesGrid.innerHTML = this.createLoadingCards(12);

            const moviesRef = collection(db, COLLECTIONS.MOVIES);
            let q = query(
                moviesRef,
                orderBy('createdAt', 'desc'),
                limit(this.moviesPerPage)
            );

            const snapshot = await getDocs(q);
            this.movies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
            this.filteredMovies = [...this.movies];
            this.renderMovies();

        } catch (error) {
            console.error('Error loading movies:', error);
            this.movies = this.getFallbackMovies();
            this.filteredMovies = [...this.movies];
            this.renderMovies();
        }
    }

    async loadMoreMovies() {
        if (!this.lastVisible) return;

        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
        }

        try {
            const moviesRef = collection(db, COLLECTIONS.MOVIES);
            const q = query(
                moviesRef,
                orderBy('createdAt', 'desc'),
                startAfter(this.lastVisible),
                limit(this.moviesPerPage)
            );

            const snapshot = await getDocs(q);
            const newMovies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.movies = [...this.movies, ...newMovies];
            this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
            
            this.filterMovies();

        } catch (error) {
            console.error('Error loading more movies:', error);
        } finally {
            if (loadMoreBtn) {
                loadMoreBtn.textContent = 'Load More Movies';
                loadMoreBtn.disabled = false;
            }
        }
    }

    getFallbackMovies() {
        return [
            {
                id: 'movie1',
                title: 'Bollywood Blockbuster',
                description: 'A thrilling action-packed adventure that will keep you on the edge of your seat.',
                thumbnailURL: 'https://via.placeholder.com/300x400?text=Movie+1',
                videoURL: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                language: 'hindi',
                genre: 'action',
                year: 2024,
                duration: '2h 45m',
                category: 'featured'
            },
            {
                id: 'movie2',
                title: 'Bengali Classic',
                description: 'A beautiful story of love, family, and tradition set in rural Bengal.',
                thumbnailURL: 'https://via.placeholder.com/300x400?text=Movie+2',
                videoURL: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                language: 'bengali',
                genre: 'drama',
                year: 2024,
                duration: '2h 15m',
                category: 'trending'
            },
            {
                id: 'movie3',
                title: 'Comedy Special',
                description: 'Laugh out loud with this hilarious comedy featuring top comedians.',
                thumbnailURL: 'https://via.placeholder.com/300x400?text=Movie+3',
                videoURL: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                language: 'hindi',
                genre: 'comedy',
                year: 2023,
                duration: '1h 55m',
                category: 'new'
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
        this.filterMovies();
    }

    filterMovies() {
        this.filteredMovies = this.movies.filter(movie => {
            // Language filter
            if (this.currentFilters.language !== 'all' && movie.language !== this.currentFilters.language) {
                return false;
            }

            // Genre filter
            if (this.currentFilters.genre !== 'all' && movie.genre !== this.currentFilters.genre) {
                return false;
            }

            // Year filter
            if (this.currentFilters.year !== 'all' && movie.year.toString() !== this.currentFilters.year) {
                return false;
            }

            // Search filter
            if (this.currentFilters.search && 
                !movie.title.toLowerCase().includes(this.currentFilters.search) &&
                !movie.description.toLowerCase().includes(this.currentFilters.search)) {
                return false;
            }

            return true;
        });

        this.renderMovies();
    }

    renderMovies() {
        const moviesGrid = document.getElementById('movies-grid');
        if (!moviesGrid) return;

        if (this.filteredMovies.length === 0) {
            moviesGrid.innerHTML = '<p class="error-message">No movies found matching your criteria.</p>';
            return;
        }

        const html = this.filteredMovies.map(movie => this.createMovieCard(movie)).join('');
        moviesGrid.innerHTML = html;

        // Add click listeners
        this.setupMovieCardListeners();
    }

    createMovieCard(movie) {
        return `
            <div class="movie-card" data-id="${movie.id}">
                <div class="card-image">
                    <img src="${movie.thumbnailURL}" alt="${movie.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${movie.title}</h3>
                    <div class="card-meta">
                        <span class="meta-item">${movie.language}</span>
                        <span class="meta-item">${movie.genre}</span>
                        <span class="meta-item">${movie.year}</span>
                        <span class="meta-item">${movie.duration}</span>
                    </div>
                    <p class="card-description">${movie.description}</p>
                </div>
            </div>
        `;
    }

    createLoadingCards(count) {
        return Array(count).fill(0).map(() => `
            <div class="movie-card loading">
                <div class="card-image" style="background: #333; animation: pulse 1.5s ease-in-out infinite alternate;">
                    <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%); background-size: 200% 100%; animation: shimmer 2s infinite;"></div>
                </div>
                <div class="card-content">
                    <div style="height: 20px; background: #333; margin-bottom: 10px; border-radius: 4px; animation: pulse 1.5s ease-in-out infinite alternate;"></div>
                    <div style="height: 15px; background: #333; width: 70%; margin-bottom: 10px; border-radius: 4px; animation: pulse 1.5s ease-in-out infinite alternate;"></div>
                    <div style="height: 60px; background: #333; border-radius: 4px; animation: pulse 1.5s ease-in-out infinite alternate;"></div>
                </div>
            </div>
        `).join('');
    }

    setupMovieCardListeners() {
        const movieCards = document.querySelectorAll('.movie-card[data-id]');
        movieCards.forEach(card => {
            card.addEventListener('click', () => {
                const movieId = card.dataset.id;
                this.showMovieModal(movieId);
            });
        });
    }

    showMovieModal(movieId) {
        const movie = this.filteredMovies.find(m => m.id === movieId);
        if (!movie) return;

        // Update modal content
        document.getElementById('modal-movie-poster').src = movie.thumbnailURL;
        document.getElementById('modal-movie-title').textContent = movie.title;
        document.getElementById('modal-movie-year').textContent = movie.year;
        document.getElementById('modal-movie-genre').textContent = movie.genre;
        document.getElementById('modal-movie-language').textContent = movie.language;
        document.getElementById('modal-movie-duration').textContent = movie.duration;
        document.getElementById('modal-movie-description').textContent = movie.description;

        // Store current movie for actions
        this.currentMovie = movie;

        // Show/hide login prompt based on auth status
        const loginPrompt = document.getElementById('login-prompt');
        const movieActions = document.querySelector('.movie-actions');
        
        if (window.authManager && window.authManager.isLoggedIn()) {
            loginPrompt.classList.add('hidden');
            movieActions.style.display = 'flex';
        } else {
            loginPrompt.classList.remove('hidden');
            movieActions.style.display = 'none';
        }

        // Show modal
        this.openModal('movie-modal');
    }

    async loadMovieDetails(movieId) {
        try {
            const movieRef = doc(db, COLLECTIONS.MOVIES, movieId);
            const movieDoc = await getDoc(movieRef);
            
            if (movieDoc.exists()) {
                const movie = { id: movieDoc.id, ...movieDoc.data() };
                this.showMovieModal(movieId);
            }
        } catch (error) {
            console.error('Error loading movie details:', error);
        }
    }

    handleWatchMovie() {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            window.authManager.openModal('login');
            return;
        }

        if (!this.currentMovie) return;

        this.closeModal('movie-modal');
        this.playMovie(this.currentMovie);
    }

    handleDownloadMovie() {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            window.authManager.openModal('login');
            return;
        }

        if (!this.currentMovie) return;

        // Create download link
        const link = document.createElement('a');
        link.href = this.currentMovie.videoURL;
        link.download = `${this.currentMovie.title}.mp4`;
        link.click();
    }

    handleFavoriteMovie() {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            window.authManager.openModal('login');
            return;
        }

        // Toggle favorite status (implement with Firestore)
        const favoriteBtn = document.getElementById('favorite-btn');
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

    playMovie(movie) {
        // Show ad first if available
        if (movie.adURL) {
            this.playAd(movie.adURL, () => {
                this.playMainVideo(movie.videoURL);
            });
        } else {
            this.playMainVideo(movie.videoURL);
        }
    }

    playAd(adURL, callback) {
        const adVideo = document.getElementById('ad-video');
        const mainVideo = document.getElementById('main-video');
        const adContainer = document.getElementById('ad-container');
        const skipTimer = document.getElementById('skip-timer');
        const skipBtn = document.getElementById('skip-btn');

        adVideo.src = adURL;
        adContainer.style.display = 'block';
        mainVideo.classList.add('hidden');

        let countdown = 5;
        skipTimer.textContent = countdown;

        const timer = setInterval(() => {
            countdown--;
            skipTimer.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(timer);
                skipBtn.classList.remove('hidden');
            }
        }, 1000);

        skipBtn.addEventListener('click', () => {
            clearInterval(timer);
            callback();
        });

        adVideo.addEventListener('ended', () => {
            clearInterval(timer);
            callback();
        });

        this.openModal('video-modal');
        adVideo.play();
    }

    playMainVideo(videoURL) {
        const adContainer = document.getElementById('ad-container');
        const mainVideo = document.getElementById('main-video');

        adContainer.style.display = 'none';
        mainVideo.classList.remove('hidden');
        mainVideo.src = videoURL;
        mainVideo.play();
    }

    stopVideo() {
        const adVideo = document.getElementById('ad-video');
        const mainVideo = document.getElementById('main-video');

        if (adVideo) {
            adVideo.pause();
            adVideo.src = '';
        }

        if (mainVideo) {
            mainVideo.pause();
            mainVideo.src = '';
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

// Initialize the movies page
document.addEventListener('DOMContentLoaded', () => {
    new MoviesPage();
});
