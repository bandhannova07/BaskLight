# BaskLight - Premium Cinematic Streaming Platform

BaskLight is a premium streaming platform for Hindi and Bengali movies and music, built with modern web technologies and designed for an exceptional cinematic experience.

## 🎬 Features

### Authentication & User Management
- **Firebase Authentication** with Email/Password and Google Sign-in
- **User Profiles** with favorites, watchlist, and download history
- **Secure Access Control** - Content restricted to logged-in users
- **Profile Management** with settings and preferences

### Content Management
- **Movies Section** with Hindi/Bengali films
- **Music Section** with songs and albums
- **Advanced Filtering** by language, genre, year
- **Search Functionality** across all content
- **Featured Content** carousel on homepage

### Streaming & Downloads
- **High-Quality Streaming** with HTML5 video/audio players
- **Download Functionality** for offline viewing (logged-in users only)
- **Pre-roll Advertisements** with skip functionality
- **Music Player** with playlist support and controls

### User Experience
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Dark Cinematic Theme** with smooth animations
- **Progressive Web App** capabilities
- **Accessibility Features** and keyboard navigation

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Advanced styling with CSS Grid, Flexbox, and animations
- **JavaScript ES6+** - Modern JavaScript with modules
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Inter & Orbitron)

### Backend & Database
- **Firebase Authentication** - User management and security
- **Cloud Firestore** - NoSQL database for content and user data
- **Firebase Storage** - Media file storage and CDN
- **Firebase Hosting** - Fast, secure web hosting

### Development & Deployment
- **Netlify** - Continuous deployment and hosting
- **Git** - Version control
- **Progressive Enhancement** - Works without JavaScript

## 📁 Project Structure

```
BaskLight-BN/
├── index.html              # Homepage
├── movies.html             # Movies catalog page
├── music.html              # Music catalog page
├── about.html              # About BandhanNova ecosystem
├── profile.html            # User profile and settings
├── css/
│   └── styles.css          # Main stylesheet with responsive design
├── js/
│   ├── firebase-config.js  # Firebase configuration and setup
│   ├── auth.js            # Authentication management
│   ├── main.js            # Homepage functionality
│   ├── movies.js          # Movies page functionality
│   ├── music.js           # Music page and player
│   └── profile.js         # Profile management
└── README.md              # Project documentation
```

## 🚀 Setup Instructions

### Prerequisites
- Modern web browser with JavaScript enabled
- Firebase project with Authentication and Firestore enabled
- Text editor or IDE

### Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Enable Cloud Firestore
   - Enable Storage (optional, for file uploads)

2. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Web" icon to create a web app
   - Copy the configuration object

3. **Update Configuration**
   - Open `js/firebase-config.js`
   - Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};
```

### Database Structure

The application uses the following Firestore collections:

#### Movies Collection (`movies`)
```javascript
{
    id: "movie_id",
    title: "Movie Title",
    description: "Movie description",
    thumbnailURL: "https://example.com/thumbnail.jpg",
    videoURL: "https://example.com/video.mp4",
    language: "hindi", // "hindi" or "bengali"
    genre: "action", // "action", "drama", "comedy", etc.
    year: 2024,
    duration: "2h 30m",
    category: "featured", // "featured", "trending", "new"
    adURL: "https://example.com/ad.mp4", // optional
    createdAt: timestamp,
    updatedAt: timestamp
}
```

#### Songs Collection (`songs`)
```javascript
{
    id: "song_id",
    title: "Song Title",
    artist: "Artist Name",
    album: "Album Name",
    thumbnailURL: "https://example.com/artwork.jpg",
    audioURL: "https://example.com/song.mp3",
    language: "hindi", // "hindi" or "bengali"
    genre: "bollywood", // "bollywood", "classical", "folk", etc.
    year: 2024,
    duration: "4:30",
    adURL: "https://example.com/ad.mp3", // optional
    createdAt: timestamp,
    updatedAt: timestamp
}
```

#### Users Collection (`users`)
```javascript
{
    uid: "user_uid",
    name: "User Name",
    email: "user@example.com",
    photoURL: "https://example.com/avatar.jpg",
    joinedOn: timestamp,
    favoriteMovies: [], // Array of movie IDs
    favoriteSongs: [], // Array of song IDs
    watchlist: [], // Array of content IDs
    downloads: [], // Array of downloaded content
    preferences: {
        autoPlay: true,
        notifications: true,
        darkMode: true
    },
    createdAt: timestamp,
    updatedAt: timestamp
}
```

### Local Development

1. **Clone or Download** the project files
2. **Update Firebase Config** as described above
3. **Serve the files** using a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

4. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - Test authentication and functionality

### Deployment to Netlify

1. **Prepare for Deployment**
   - Ensure Firebase config is updated
   - Test all functionality locally
   - Commit all changes to Git

2. **Deploy to Netlify**
   - Connect your Git repository to Netlify
   - Set build command: (none needed for static site)
   - Set publish directory: `/` (root)
   - Deploy the site

3. **Configure Domain** (optional)
   - Add custom domain in Netlify settings
   - Configure DNS records as instructed

## 🎨 Customization

### Styling
- Modify CSS variables in `css/styles.css` for colors and themes
- Update fonts by changing Google Fonts imports
- Customize animations and transitions

### Content
- Add your own movies and songs to Firestore
- Update branding and logos
- Modify the About page content for your organization

### Features
- Extend user profiles with additional fields
- Add more content categories and filters
- Implement advanced search with Algolia
- Add social features like reviews and ratings

## 🔒 Security Considerations

- **Firebase Security Rules** - Configure Firestore rules to protect user data
- **Content Protection** - Implement proper access controls for premium content
- **HTTPS Only** - Ensure all content is served over HTTPS
- **Input Validation** - Validate all user inputs on client and server side

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** with modern JavaScript support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the BandhanNova ecosystem. All rights reserved.

## 🆘 Support

For support and questions:
- Email: support@basklight.com
- Phone: +91 98765 43210

## 🚀 About BandhanNova

BaskLight is part of the BandhanNova ecosystem, providing comprehensive digital solutions including:
- Cloud infrastructure and services
- Mobile and web application development
- AI and machine learning solutions
- Cybersecurity and data protection
- Digital transformation consulting

Visit our About page to learn more about our mission and vision.

---

**Built with ❤️ by the BandhanNova Team**
