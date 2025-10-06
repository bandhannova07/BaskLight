import { db, COLLECTIONS } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    query, 
    limit, 
    orderBy, 
    where 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

class BaskLightApp {
    constructor() {
        this.featuredContent = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedContent();
        this.setupHeroSlider();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Hero buttons
        const heroWatch = document.getElementById('hero-watch');
        const heroLearn = document.getElementById('hero-learn');

        if (heroWatch) {
            heroWatch.addEventListener('click', () => {
                if (window.authManager && window.authManager.isLoggedIn()) {
                    window.location.href = 'movies.html';
                } else {
                    window.authManager.openModal('login');
                }
            });
        }

        if (heroLearn) {
            heroLearn.addEventListener('click', () => {
                window.location.href = 'about.html';
            });
        }

        // Category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.handleCategoryClick(category);
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(15, 15, 35, 0.98)';
                } else {
                    navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                }
            }
        });
    }

    setupHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.indicator');
        let currentSlide = 0;

        if (slides.length === 0) return;

        // Auto-advance slides
        setInterval(() => {
            this.nextSlide();
        }, 5000);

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }

    nextSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        if (slides.length === 0) return;

        // Remove active class from current slide and indicator
        slides[this.currentSlide]?.classList.remove('active');
        indicators[this.currentSlide]?.classList.remove('active');

        // Move to next slide
        this.currentSlide = (this.currentSlide + 1) % slides.length;

        // Add active class to new slide and indicator
        slides[this.currentSlide]?.classList.add('active');
        indicators[this.currentSlide]?.classList.add('active');
    }

    goToSlide(index) {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.indicator');

        if (slides.length === 0) return;

        // Remove active class from current slide and indicator
        slides[this.currentSlide]?.classList.remove('active');
        indicators[this.currentSlide]?.classList.remove('active');

        // Set new slide
        this.currentSlide = index;

        // Add active class to new slide and indicator
        slides[this.currentSlide]?.classList.add('active');
        indicators[this.currentSlide]?.classList.add('active');
    }

    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.category-card, .featured-grid > *');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    async loadFeaturedContent() {
        const featuredGrid = document.getElementById('featured-grid');
        if (!featuredGrid) return;

        try {
            // Show loading state
            featuredGrid.innerHTML = this.createLoadingCards(6);

            // Load featured movies and songs
            const [movies, songs] = await Promise.all([
                this.loadFeaturedMovies(),
                this.loadFeaturedSongs()
            ]);

            // Combine and shuffle content
            this.featuredContent = [...movies, ...songs].sort(() => Math.random() - 0.5);

            // Render featured content
            this.renderFeaturedContent();

        } catch (error) {
            console.error('Error loading featured content:', error);
            featuredGrid.innerHTML = '<p class="error-message">Failed to load content. Please try again later.</p>';
        }
    }

    async loadFeaturedMovies() {
        try {
            const moviesRef = collection(db, COLLECTIONS.MOVIES);
            const q = query(
                moviesRef, 
                where('category', '==', 'featured'),
                orderBy('createdAt', 'desc'),
                limit(6)
            );
            const snapshot = await getDocs(q);
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                type: 'movie',
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading featured movies:', error);
            return this.getFallbackMovies();
        }
    }

    async loadFeaturedSongs() {
        try {
            const songsRef = collection(db, COLLECTIONS.SONGS);
            const q = query(
                songsRef,
                orderBy('createdAt', 'desc'),
                limit(4)
            );
            const snapshot = await getDocs(q);
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                type: 'song',
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading featured songs:', error);
            return this.getFallbackSongs();
        }
    }

    getFallbackMovies() {
        return [
            {
                id: 'movie1',
                type: 'movie',
                title: 'Sample Hindi Movie',
                description: 'A captivating story of love and adventure.',
                thumbnailURL: 'https://via.placeholder.com/300x400?text=Movie+1',
                language: 'hindi',
                genre: 'drama',
                year: 2024
            },
            {
                id: 'movie2',
                type: 'movie',
                title: 'Sample Bengali Movie',
                description: 'A beautiful tale of family and tradition.',
                thumbnailURL: 'https://via.placeholder.com/300x400?text=Movie+2',
                language: 'bengali',
                genre: 'family',
                year: 2024
            }
        ];
    }

    getFallbackSongs() {
        return [
            {
                id: 'song1',
                type: 'song',
                title: 'Sample Hindi Song',
                artist: 'Popular Artist',
                thumbnailURL: 'https://via.placeholder.com/300x300?text=Song+1',
                language: 'hindi',
                genre: 'bollywood'
            },
            {
                id: 'song2',
                type: 'song',
                title: 'Sample Bengali Song',
                artist: 'Famous Singer',
                thumbnailURL: 'https://via.placeholder.com/300x300?text=Song+2',
                language: 'bengali',
                genre: 'classical'
            }
        ];
    }

    renderFeaturedContent() {
        const featuredGrid = document.getElementById('featured-grid');
        if (!featuredGrid) return;

        const html = this.featuredContent.slice(0, 8).map(item => {
            return this.createContentCard(item);
        }).join('');

        featuredGrid.innerHTML = html;

        // Add click listeners to cards
        this.setupContentCardListeners();
    }

    createContentCard(item) {
        const isMovie = item.type === 'movie';
        const metaItems = [];
        
        if (isMovie) {
            metaItems.push(
                `<span class="meta-item">${item.language}</span>`,
                `<span class="meta-item">${item.genre}</span>`,
                `<span class="meta-item">${item.year}</span>`
            );
        } else {
            metaItems.push(
                `<span class="meta-item">${item.artist}</span>`,
                `<span class="meta-item">${item.language}</span>`,
                `<span class="meta-item">${item.genre}</span>`
            );
        }

        return `
            <div class="movie-card" data-id="${item.id}" data-type="${item.type}">
                <div class="card-image">
                    <img src="${item.thumbnailURL}" alt="${item.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        ${metaItems.join('')}
                    </div>
                    ${item.description ? `<p class="card-description">${item.description}</p>` : ''}
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
                    <div style="height: 15px; background: #333; width: 70%; border-radius: 4px; animation: pulse 1.5s ease-in-out infinite alternate;"></div>
                </div>
            </div>
        `).join('');
    }

    setupContentCardListeners() {
        const cards = document.querySelectorAll('.movie-card[data-id]');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const type = card.dataset.type;
                this.handleContentClick(id, type);
            });
        });
    }

    handleContentClick(id, type) {
        if (type === 'movie') {
            window.location.href = `movies.html?id=${id}`;
        } else if (type === 'song') {
            window.location.href = `music.html?id=${id}`;
        }
    }

    handleCategoryClick(category) {
        switch (category) {
            case 'movies':
                window.location.href = 'movies.html';
                break;
            case 'music':
                window.location.href = 'music.html';
                break;
            case 'trending':
                window.location.href = 'movies.html?filter=trending';
                break;
            case 'new':
                window.location.href = 'movies.html?filter=new';
                break;
            default:
                console.log('Unknown category:', category);
        }
    }
}

// Add CSS for loading animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 0.6; }
        100% { opacity: 1; }
    }
    
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--text-secondary);
        padding: 2rem;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BaskLightApp();
});

// Initialize current slide counter
BaskLightApp.prototype.currentSlide = 0;
