# Career Mitra Frontend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Installation

1. **Navigate to frontend folder**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The frontend will open at `http://localhost:3000`

---

## 📁 Project Structure Quick Reference

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── layouts/            # Layout wrappers
├── data/               # Mock data
├── hooks/              # Custom React hooks
├── context/            # React Context
├── services/           # API services
├── utils/              # Helper functions
└── index.css           # Global styles
```

---

## 🎯 Key Pages

| URL | Component | Purpose |
|-----|-----------|---------|
| `/` | LandingPage | Home page |
| `/login` | LoginPage | User login |
| `/signup` | SignupPage | User registration |
| `/mentors` | MentorListing | Browse mentors |
| `/mentors/:id` | MentorProfile | Mentor details |
| `/student/dashboard` | StudentDashboard | Student home |
| `/mentor/dashboard` | MentorDashboard | Mentor home |
| `/admin/dashboard` | AdminDashboard | Admin panel |

---

## 🛠️ Available Scripts

### Development
```bash
npm start
```
Runs app in development mode with hot reload

### Production Build
```bash
npm run build
```
Creates optimized production build

### Test
```bash
npm test
```
Launches test runner

---

## 📦 Main Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.0",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.16.4",
  "axios": "^1.4.0",
  "react-icons": "^4.10.1",
  "@reduxjs/toolkit": "^1.9.5"
}
```

---

## 🎨 Tailwind CSS

The project uses Tailwind CSS for styling. Configure in `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        // Add more custom colors
      }
    }
  }
}
```

---

## 🧩 Creating New Components

### Basic Component Template
```jsx
import React from 'react';
import { motion } from 'framer-motion';

const MyComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      {/* Content */}
    </motion.div>
  );
};

export default MyComponent;
```

---

## 🔗 API Integration

Update `src/services/api.js` to connect to backend:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
});

// Add authentication token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

---

## 🔐 Environment Variables

Create `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_PAYMENT_KEY=your_razorpay_key
```

---

## 🎨 UI Component Usage

### Button
```jsx
<Button variant="primary" size="md">Click me</Button>
```

### Card
```jsx
<Card className="p-6">
  Content here
</Card>
```

### Input
```jsx
<Input label="Email" type="email" />
```

### Badge
```jsx
<Badge variant="primary">Tag</Badge>
```

---

## 🔄 State Management

Using Redux Toolkit for global state:

```jsx
import { useDispatch, useSelector } from 'react-redux';

const component = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.data);
  
  // Use dispatch and selector
};
```

---

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Usage:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

---

## 🎬 Animation Examples

### Simple Fade In
```jsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  Content
</motion.div>
```

### Hover Effect
```jsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>
```

### Page Transition
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Page content
</motion.div>
```

---

## 🐛 Debugging

### Console Logging
```bash
npm start
# Check browser console for errors
```

### React Developer Tools
Install Chrome extension: "React Developer Tools"

### Redux DevTools
Install Chrome extension: "Redux DevTools"

---

## 📝 Common Tasks

### Add a New Page
1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Navbar.jsx`

### Add a New Component
1. Create component in `src/components/`
2. Export from component
3. Import and use where needed

### Update Styles
1. Modify `src/index.css` for global styles
2. Use inline Tailwind classes for components
3. Update `tailwind.config.js` for custom colors

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload build folder to Netlify
```

### Environment Variables for Production
Add to your hosting platform:
```
REACT_APP_API_URL=https://api.careermitra.com
REACT_APP_PAYMENT_KEY=production_key
```

---

## 📊 Performance Tips

1. **Lazy Load Routes**
```jsx
const MentorListing = lazy(() => import('./pages/student/MentorListing'));
```

2. **Memoize Components**
```jsx
export default memo(MyComponent);
```

3. **Optimize Images**
- Use WebP format
- Resize images appropriately
- Use CDN for delivery

4. **Code Splitting**
- Already configured with React Router
- Dynamic imports for components

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

---

## 📞 Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3001 npm start
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
# Check for errors
npm run build --verbose
```

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Router](https://reactrouter.com)

---

## 🎉 You're Ready!

The frontend is production-ready. Just connect it to your backend API and you're good to go!

For questions or issues, refer to the component documentation or the implementation summary.

**Happy coding! 🚀**
