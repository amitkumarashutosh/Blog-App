# Blog Application

A full-stack blog application that allows users to create, read, update and delete blog posts with image upload functionality.

## 🚀 Live Demos
- [Render Deployment](https://blog-app-yn3p.onrender.com/)
- <img width="1511" alt="Screenshot 2025-01-01 at 4 17 33 PM" src="https://github.com/user-attachments/assets/de8276d4-2a34-40bb-adf7-c361e2f17e75" />


## ✨ Features

### User Features
- User registration and authentication
- Create personal profile
- View all blog posts
- Read individual blog posts
- Comment on blog posts
- Like/unlike blog posts

### Admin Features
- Dashboard overview
- Manage all blog posts
- Moderate user comments
- User management
- Content moderation
- Analytics tracking

## 💻 Tech Stack
- Frontend: React + Vite
- Backend: Node.js/Express
- Database: MongoDB
- Image Upload: Multer
- Authentication: JWT

## 🛠️ Local Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/blog-app.git
```
```bash
cd client && npm install
```
```bash
cd server && npm install
```

2. Create .env file in root directory
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3.Run the client and server, then view the application at http://localhost:5000
```bash
cd client && npm run dev
```
```bash
cd server && npm run dev

```


