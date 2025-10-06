import { auth, db, googleProvider, COLLECTIONS } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.updateUI(user);
            if (user) {
                this.createOrUpdateUserProfile(user);
            }
        });

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal controls
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const authModal = document.getElementById('auth-modal');
        const modalClose = document.getElementById('modal-close');
        const logoutBtn = document.getElementById('logout-btn');

        // Auth tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');

        // Forms
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const googleLoginBtn = document.getElementById('google-login');
        const googleSignupBtn = document.getElementById('google-signup');

        // Modal open/close
        if (loginBtn) loginBtn.addEventListener('click', () => this.openModal('login'));
        if (signupBtn) signupBtn.addEventListener('click', () => this.openModal('signup'));
        if (modalClose) modalClose.addEventListener('click', () => this.closeModal());
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

        // Click outside modal to close
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) this.closeModal();
            });
        }

        // Auth tabs switching
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.dataset.tab;
                this.switchTab(tabType);
            });
        });

        // Form submissions
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Google auth
        if (googleLoginBtn) googleLoginBtn.addEventListener('click', () => this.handleGoogleAuth());
        if (googleSignupBtn) googleSignupBtn.addEventListener('click', () => this.handleGoogleAuth());

        // Login prompts in modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-login-prompt')) {
                this.openModal('login');
            }
        });
    }

    openModal(tab = 'login') {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            this.switchTab(tab);
        }
    }

    closeModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    }

    switchTab(tabType) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabType) {
                tab.classList.add('active');
            }
        });

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
            if (form.id === `${tabType}-form`) {
                form.classList.add('active');
            }
        });
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        this.showLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            this.closeModal();
            this.showSuccess('Login successful!');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        } finally {
            this.showLoading(false);
        }
    }

    async handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        if (!name || !email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        this.showLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            this.closeModal();
            this.showSuccess('Account created successfully!');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        } finally {
            this.showLoading(false);
        }
    }

    async handleGoogleAuth() {
        this.showLoading(true);

        try {
            await signInWithPopup(auth, googleProvider);
            this.closeModal();
            this.showSuccess('Login successful!');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        } finally {
            this.showLoading(false);
        }
    }

    async logout() {
        try {
            await signOut(auth);
            this.showSuccess('Logged out successfully');
            // Redirect to home if on profile page
            if (window.location.pathname.includes('profile.html')) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            this.showError('Error logging out');
        }
    }

    async createOrUpdateUserProfile(user) {
        try {
            const userRef = doc(db, COLLECTIONS.USERS, user.uid);
            const userDoc = await getDoc(userRef);

            const userData = {
                uid: user.uid,
                name: user.displayName || 'User',
                email: user.email,
                photoURL: user.photoURL || '',
                updatedAt: new Date()
            };

            if (!userDoc.exists()) {
                // Create new user profile
                userData.joinedOn = new Date();
                userData.favoriteMovies = [];
                userData.favoriteSongs = [];
                userData.watchlist = [];
                userData.downloads = [];
                userData.preferences = {
                    autoPlay: true,
                    notifications: true,
                    darkMode: true
                };
                userData.createdAt = new Date();

                await setDoc(userRef, userData);
            } else {
                // Update existing user profile
                await updateDoc(userRef, userData);
            }
        } catch (error) {
            console.error('Error creating/updating user profile:', error);
        }
    }

    updateUI(user) {
        const navAuth = document.getElementById('nav-auth');
        const navUser = document.getElementById('nav-user');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');

        if (user) {
            // User is logged in
            if (navAuth) navAuth.classList.add('hidden');
            if (navUser) navUser.classList.remove('hidden');
            
            if (userAvatar) {
                userAvatar.src = user.photoURL || 'https://via.placeholder.com/32x32?text=U';
                userAvatar.alt = user.displayName || 'User';
            }
            
            if (userName) {
                userName.textContent = user.displayName || 'User';
            }

            // Update profile page if we're on it
            this.updateProfilePage(user);
        } else {
            // User is not logged in
            if (navAuth) navAuth.classList.remove('hidden');
            if (navUser) navUser.classList.add('hidden');
        }
    }

    updateProfilePage(user) {
        // Only update if we're on the profile page
        if (!window.location.pathname.includes('profile.html')) return;

        const profileAvatar = document.getElementById('profile-avatar');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');

        if (profileAvatar) profileAvatar.src = user.photoURL || 'https://via.placeholder.com/120x120?text=U';
        if (profileName) profileName.textContent = user.displayName || 'User';
        if (profileEmail) profileEmail.textContent = user.email;

        // Load user data from Firestore
        this.loadUserData(user.uid);
    }

    async loadUserData(uid) {
        try {
            const userRef = doc(db, COLLECTIONS.USERS, uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Update join date
                const joinDate = document.getElementById('join-date');
                if (joinDate && userData.joinedOn) {
                    const date = userData.joinedOn.toDate ? userData.joinedOn.toDate() : new Date(userData.joinedOn);
                    joinDate.textContent = date.toLocaleDateString();
                }

                // Update favorites count
                const favoritesCount = document.getElementById('favorites-count');
                if (favoritesCount) {
                    const totalFavorites = (userData.favoriteMovies?.length || 0) + (userData.favoriteSongs?.length || 0);
                    favoritesCount.textContent = totalFavorites;
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/email-already-in-use':
                return 'Email is already registered';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/popup-closed-by-user':
                return 'Login cancelled';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        // Simple alert for now - can be replaced with custom notification
        alert('Error: ' + message);
    }

    showSuccess(message) {
        // Simple alert for now - can be replaced with custom notification
        alert(message);
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.currentUser;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Require authentication for certain actions
    requireAuth(callback) {
        if (this.isLoggedIn()) {
            callback();
        } else {
            this.openModal('login');
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other modules
window.authManager = authManager;
