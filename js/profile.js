import { db, auth, COLLECTIONS } from './firebase-config.js';
import { 
    doc, 
    getDoc, 
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { 
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    deleteUser
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

class ProfilePage {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        this.currentUser = window.authManager.getCurrentUser();
        this.setupEventListeners();
        this.loadUserProfile();
    }

    setupEventListeners() {
        // Profile tabs
        const profileTabs = document.querySelectorAll('.profile-tab');
        profileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Edit profile button
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.openEditProfileModal();
            });
        }

        // Modal controls
        const editModal = document.getElementById('edit-profile-modal');
        const editModalClose = document.getElementById('edit-modal-close');
        const passwordModal = document.getElementById('password-modal');
        const passwordModalClose = document.getElementById('password-modal-close');

        if (editModalClose) {
            editModalClose.addEventListener('click', () => {
                this.closeModal('edit-profile-modal');
            });
        }

        if (passwordModalClose) {
            passwordModalClose.addEventListener('click', () => {
                this.closeModal('password-modal');
            });
        }

        // Click outside modal to close
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    this.closeModal('edit-profile-modal');
                }
            });
        }

        if (passwordModal) {
            passwordModal.addEventListener('click', (e) => {
                if (e.target === passwordModal) {
                    this.closeModal('password-modal');
                }
            });
        }

        // Form submissions
        const editProfileForm = document.getElementById('edit-profile-form');
        const changePasswordForm = document.getElementById('change-password-form');
        const accountSettingsForm = document.getElementById('account-settings');

        if (editProfileForm) {
            editProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditProfile();
            });
        }

        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChangePassword();
            });
        }

        if (accountSettingsForm) {
            accountSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAccountSettings();
            });
        }

        // Cancel buttons
        const cancelEditBtn = document.getElementById('cancel-edit');
        const cancelPasswordBtn = document.getElementById('cancel-password');

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.closeModal('edit-profile-modal');
            });
        }

        if (cancelPasswordBtn) {
            cancelPasswordBtn.addEventListener('click', () => {
                this.closeModal('password-modal');
            });
        }

        // Settings buttons
        const changePasswordBtn = document.getElementById('change-password-btn');
        const downloadDataBtn = document.getElementById('download-data-btn');
        const deleteAccountBtn = document.getElementById('delete-account-btn');

        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.openPasswordModal();
            });
        }

        if (downloadDataBtn) {
            downloadDataBtn.addEventListener('click', () => {
                this.downloadUserData();
            });
        }

        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.handleDeleteAccount();
            });
        }

        // Preference toggles
        const preferenceToggles = document.querySelectorAll('.switch input');
        preferenceToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updatePreference(e.target.id, e.target.checked);
            });
        });

        // Avatar edit
        const avatarEdit = document.getElementById('avatar-edit');
        if (avatarEdit) {
            avatarEdit.addEventListener('click', () => {
                document.getElementById('edit-avatar').click();
            });
        }

        // Avatar file input
        const editAvatar = document.getElementById('edit-avatar');
        if (editAvatar) {
            editAvatar.addEventListener('change', (e) => {
                this.handleAvatarChange(e);
            });
        }
    }

    async loadUserProfile() {
        if (!this.currentUser) return;

        try {
            // Load user data from Firestore
            const userRef = doc(db, COLLECTIONS.USERS, this.currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                this.userData = userDoc.data();
                this.updateProfileUI();
                this.loadUserContent();
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    updateProfileUI() {
        if (!this.userData) return;

        // Update profile header
        const profileAvatar = document.getElementById('profile-avatar');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const joinDate = document.getElementById('join-date');
        const favoritesCount = document.getElementById('favorites-count');

        if (profileAvatar) {
            profileAvatar.src = this.userData.photoURL || this.currentUser.photoURL || 'https://via.placeholder.com/120x120?text=U';
        }

        if (profileName) {
            profileName.textContent = this.userData.name || this.currentUser.displayName || 'User';
        }

        if (profileEmail) {
            profileEmail.textContent = this.userData.email || this.currentUser.email;
        }

        if (joinDate && this.userData.joinedOn) {
            const date = this.userData.joinedOn.toDate ? this.userData.joinedOn.toDate() : new Date(this.userData.joinedOn);
            joinDate.textContent = date.toLocaleDateString();
        }

        if (favoritesCount) {
            const totalFavorites = (this.userData.favoriteMovies?.length || 0) + (this.userData.favoriteSongs?.length || 0);
            favoritesCount.textContent = totalFavorites;
        }

        // Update settings form
        const displayName = document.getElementById('display-name');
        const emailSettings = document.getElementById('email-settings');
        const bio = document.getElementById('bio');

        if (displayName) displayName.value = this.userData.name || '';
        if (emailSettings) emailSettings.value = this.userData.email || '';
        if (bio) bio.value = this.userData.bio || '';

        // Update preferences
        if (this.userData.preferences) {
            const autoPlay = document.getElementById('auto-play');
            const notifications = document.getElementById('notifications');
            const darkMode = document.getElementById('dark-mode');

            if (autoPlay) autoPlay.checked = this.userData.preferences.autoPlay || false;
            if (notifications) notifications.checked = this.userData.preferences.notifications || false;
            if (darkMode) darkMode.checked = this.userData.preferences.darkMode || true;
        }
    }

    async loadUserContent() {
        if (!this.userData) return;

        // Load favorite movies
        if (this.userData.favoriteMovies && this.userData.favoriteMovies.length > 0) {
            await this.loadFavoriteMovies();
        }

        // Load favorite songs
        if (this.userData.favoriteSongs && this.userData.favoriteSongs.length > 0) {
            await this.loadFavoriteSongs();
        }

        // Load downloads (placeholder for now)
        this.loadDownloads();
    }

    async loadFavoriteMovies() {
        const favoriteMoviesContainer = document.getElementById('favorite-movies');
        if (!favoriteMoviesContainer) return;

        try {
            const moviesRef = collection(db, COLLECTIONS.MOVIES);
            const q = query(moviesRef, where('__name__', 'in', this.userData.favoriteMovies.slice(0, 10)));
            const snapshot = await getDocs(q);

            const movies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const html = movies.map(movie => this.createFavoriteCard(movie, 'movie')).join('');
            favoriteMoviesContainer.innerHTML = html || '<p>No favorite movies yet.</p>';

        } catch (error) {
            console.error('Error loading favorite movies:', error);
            favoriteMoviesContainer.innerHTML = '<p>Error loading favorite movies.</p>';
        }
    }

    async loadFavoriteSongs() {
        const favoriteSongsContainer = document.getElementById('favorite-songs');
        if (!favoriteSongsContainer) return;

        try {
            const songsRef = collection(db, COLLECTIONS.SONGS);
            const q = query(songsRef, where('__name__', 'in', this.userData.favoriteSongs.slice(0, 10)));
            const snapshot = await getDocs(q);

            const songs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const html = songs.map(song => this.createFavoriteCard(song, 'song')).join('');
            favoriteSongsContainer.innerHTML = html || '<p>No favorite songs yet.</p>';

        } catch (error) {
            console.error('Error loading favorite songs:', error);
            favoriteSongsContainer.innerHTML = '<p>Error loading favorite songs.</p>';
        }
    }

    loadDownloads() {
        const downloadedMovies = document.getElementById('downloaded-movies');
        const downloadedSongs = document.getElementById('downloaded-songs');

        if (downloadedMovies) {
            downloadedMovies.innerHTML = '<p>No downloaded movies yet.</p>';
        }

        if (downloadedSongs) {
            downloadedSongs.innerHTML = '<p>No downloaded songs yet.</p>';
        }
    }

    createFavoriteCard(item, type) {
        const isMovie = type === 'movie';
        const title = item.title;
        const subtitle = isMovie ? `${item.year} • ${item.genre}` : `${item.artist} • ${item.album}`;

        return `
            <div class="favorite-item" data-id="${item.id}" data-type="${type}">
                <img src="${item.thumbnailURL}" alt="${title}" loading="lazy">
                <div class="favorite-info">
                    <h4>${title}</h4>
                    <p>${subtitle}</p>
                </div>
                <button class="remove-favorite" data-id="${item.id}" data-type="${type}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    openEditProfileModal() {
        // Pre-fill form with current data
        const editName = document.getElementById('edit-name');
        const editBio = document.getElementById('edit-bio');

        if (editName) editName.value = this.userData?.name || this.currentUser?.displayName || '';
        if (editBio) editBio.value = this.userData?.bio || '';

        this.openModal('edit-profile-modal');
    }

    openPasswordModal() {
        // Clear form
        const form = document.getElementById('change-password-form');
        if (form) form.reset();

        this.openModal('password-modal');
    }

    async handleEditProfile() {
        const name = document.getElementById('edit-name').value;
        const bio = document.getElementById('edit-bio').value;

        if (!name.trim()) {
            alert('Name is required');
            return;
        }

        try {
            // Update Firebase Auth profile
            await updateProfile(this.currentUser, {
                displayName: name
            });

            // Update Firestore user document
            const userRef = doc(db, COLLECTIONS.USERS, this.currentUser.uid);
            await updateDoc(userRef, {
                name: name,
                bio: bio,
                updatedAt: new Date()
            });

            // Update local data
            this.userData.name = name;
            this.userData.bio = bio;

            // Update UI
            this.updateProfileUI();
            this.closeModal('edit-profile-modal');

            alert('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    }

    async handleChangePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }

        try {
            // Re-authenticate user
            const credential = EmailAuthProvider.credential(this.currentUser.email, currentPassword);
            await reauthenticateWithCredential(this.currentUser, credential);

            // Update password
            await updatePassword(this.currentUser, newPassword);

            this.closeModal('password-modal');
            alert('Password updated successfully!');

        } catch (error) {
            console.error('Error updating password:', error);
            if (error.code === 'auth/wrong-password') {
                alert('Current password is incorrect');
            } else {
                alert('Error updating password. Please try again.');
            }
        }
    }

    async handleAccountSettings() {
        const displayName = document.getElementById('display-name').value;
        const bio = document.getElementById('bio').value;

        try {
            // Update Firestore user document
            const userRef = doc(db, COLLECTIONS.USERS, this.currentUser.uid);
            await updateDoc(userRef, {
                name: displayName,
                bio: bio,
                updatedAt: new Date()
            });

            // Update Firebase Auth profile
            await updateProfile(this.currentUser, {
                displayName: displayName
            });

            alert('Settings saved successfully!');

        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings. Please try again.');
        }
    }

    async updatePreference(preferenceKey, value) {
        try {
            const userRef = doc(db, COLLECTIONS.USERS, this.currentUser.uid);
            await updateDoc(userRef, {
                [`preferences.${preferenceKey}`]: value,
                updatedAt: new Date()
            });

            // Update local data
            if (!this.userData.preferences) {
                this.userData.preferences = {};
            }
            this.userData.preferences[preferenceKey] = value;

        } catch (error) {
            console.error('Error updating preference:', error);
        }
    }

    handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        // For now, just show a preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const profileAvatar = document.getElementById('profile-avatar');
            if (profileAvatar) {
                profileAvatar.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);

        // In a real implementation, you would upload to Firebase Storage
        alert('Avatar upload functionality would be implemented here');
    }

    downloadUserData() {
        const data = {
            profile: {
                name: this.userData?.name,
                email: this.userData?.email,
                joinedOn: this.userData?.joinedOn,
                bio: this.userData?.bio
            },
            favorites: {
                movies: this.userData?.favoriteMovies || [],
                songs: this.userData?.favoriteSongs || []
            },
            preferences: this.userData?.preferences || {}
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'basklight-user-data.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    async handleDeleteAccount() {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:');
        if (confirmation !== 'DELETE') {
            return;
        }

        const password = prompt('Enter your password to confirm:');
        if (!password) {
            return;
        }

        try {
            // Re-authenticate user
            const credential = EmailAuthProvider.credential(this.currentUser.email, password);
            await reauthenticateWithCredential(this.currentUser, credential);

            // Delete user account
            await deleteUser(this.currentUser);

            alert('Account deleted successfully');
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error deleting account:', error);
            if (error.code === 'auth/wrong-password') {
                alert('Incorrect password');
            } else {
                alert('Error deleting account. Please try again.');
            }
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

// Initialize the profile page
document.addEventListener('DOMContentLoaded', () => {
    new ProfilePage();
});
