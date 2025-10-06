# BaskLight Deployment Guide

## 🚀 Pre-Deployment Checklist

### Firebase Setup Required
Before deploying, you **MUST** configure Firebase:

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project named "BaskLight" or similar
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** provider
   - Enable **Google** provider
   - Add your domain to authorized domains

3. **Setup Firestore Database**
   - Go to Firestore Database
   - Create database in **production mode**
   - Choose your preferred region
   - Set up security rules (see below)

4. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Add a web app
   - Copy the configuration object

5. **Update Configuration File**
   - Open `js/firebase-config.js`
   - Replace placeholder values with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Movies and songs are readable by authenticated users
    match /movies/{movieId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write (implement admin check)
    }
    
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write (implement admin check)
    }
    
    // Ads are readable by authenticated users
    match /ads/{adId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write
    }
  }
}
```

### Content Setup (Optional)

Add sample content to test the platform:

1. **Sample Movies** (Add to `movies` collection):
```javascript
{
  title: "Sample Hindi Movie",
  description: "A captivating story of love and adventure in modern India.",
  thumbnailURL: "https://via.placeholder.com/300x400?text=Hindi+Movie",
  videoURL: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  language: "hindi",
  genre: "drama",
  year: 2024,
  duration: "2h 15m",
  category: "featured",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

2. **Sample Songs** (Add to `songs` collection):
```javascript
{
  title: "Sample Bollywood Song",
  artist: "Famous Singer",
  album: "Latest Hits",
  thumbnailURL: "https://via.placeholder.com/300x300?text=Song",
  audioURL: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  language: "hindi",
  genre: "bollywood",
  year: 2024,
  duration: "4:30",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## 🌐 Netlify Deployment

### Method 1: Git Integration (Recommended)

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial BaskLight platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/basklight.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab account
   - Select your BaskLight repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `/` (root)
   - Click "Deploy site"

### Method 2: Manual Upload

1. **Prepare Files**
   - Ensure Firebase config is updated
   - Test locally first
   - Zip all project files

2. **Upload to Netlify**
   - Go to Netlify dashboard
   - Drag and drop your project folder
   - Wait for deployment to complete

### Method 3: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and Deploy**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod --dir .
   ```

## 🔧 Post-Deployment Configuration

### 1. Update Firebase Authorized Domains
- Go to Firebase Console > Authentication > Settings
- Add your Netlify domain to authorized domains:
  - `your-site-name.netlify.app`
  - Your custom domain (if applicable)

### 2. Test Core Functionality
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Google authentication works
- [ ] Movies page displays content
- [ ] Music page displays content
- [ ] Profile page accessible after login
- [ ] Search functionality works
- [ ] Responsive design on mobile

### 3. Performance Optimization
- [ ] Enable Netlify's asset optimization
- [ ] Configure caching headers (already in netlify.toml)
- [ ] Test loading speeds
- [ ] Optimize images if needed

## 🎨 Customization for Production

### Branding Updates
1. **Replace Placeholder Content**
   - Update hero section text
   - Add real movie/song thumbnails
   - Replace placeholder images

2. **Contact Information**
   - Update email addresses in footer
   - Update phone numbers
   - Update social media links

3. **About Page Content**
   - Customize BandhanNova ecosystem description
   - Update team information
   - Add real statistics

### Content Management
1. **Add Real Content**
   - Upload actual movies to Firebase Storage or CDN
   - Add real song files
   - Create proper thumbnail images

2. **Content Organization**
   - Organize by categories (featured, trending, new)
   - Set up proper metadata
   - Implement content moderation

## 🔒 Security Considerations

### Production Security
- [ ] Review and tighten Firestore security rules
- [ ] Implement admin authentication for content management
- [ ] Set up proper CORS policies
- [ ] Enable Firebase App Check (recommended)
- [ ] Regular security audits

### Content Protection
- [ ] Implement proper access controls
- [ ] Consider DRM for premium content
- [ ] Set up content delivery network (CDN)
- [ ] Monitor for unauthorized access

## 📊 Analytics & Monitoring

### Setup Analytics
1. **Google Analytics** (if enabled in Firebase)
2. **Netlify Analytics** for site performance
3. **Firebase Performance Monitoring**
4. **Error tracking** with Firebase Crashlytics

### Monitoring Checklist
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor user engagement
- [ ] Track conversion rates

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify API keys are correct
   - Check authorized domains
   - Ensure services are enabled

2. **Authentication Issues**
   - Check Firebase Auth configuration
   - Verify redirect URLs
   - Test in incognito mode

3. **Content Not Loading**
   - Check Firestore security rules
   - Verify collection names
   - Test database queries

4. **Mobile Responsiveness**
   - Test on actual devices
   - Check viewport meta tag
   - Verify CSS media queries

### Support Resources
- Firebase Documentation: https://firebase.google.com/docs
- Netlify Documentation: https://docs.netlify.com
- MDN Web Docs: https://developer.mozilla.org

## 📞 Support

For deployment support:
- **Email**: support@basklight.com
- **Documentation**: Check README.md for detailed setup
- **Issues**: Create GitHub issues for bugs

---

**🎉 Congratulations! Your BaskLight platform is ready for production!**

Remember to:
1. ✅ Update Firebase configuration
2. ✅ Test all functionality
3. ✅ Add real content
4. ✅ Configure security rules
5. ✅ Monitor performance

**Next Steps**: Add real movies and music content, set up content management workflows, and start building your user base!
