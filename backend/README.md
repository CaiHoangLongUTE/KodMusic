# KodMusic Backend API

Backend server for the KodMusic application built with Node.js, Express, MongoDB, and Cloudinary.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (free tier available at https://cloudinary.com)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Update `.env` file (or copy from `.env.example`) with your credentials:
   - **MongoDB URI**: Your MongoDB connection string
   - **Cloudinary credentials**: Get these from your Cloudinary dashboard

### Getting Cloudinary Credentials

1. Sign up at https://cloudinary.com (free)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Add them to your `.env` file

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:8000`

## API Endpoints

### Songs
- **POST** `/api/song/add` - Add a new song (multipart/form-data)
  - Fields: name, desc, album, image (file), audio (file)
  - Files are uploaded to Cloudinary
- **GET** `/api/song/list` - Get all songs
- **DELETE** `/api/song/remove` - Remove a song
  - Body: { id: "song_id" }

### Albums
- **POST** `/api/album/add` - Add a new album (multipart/form-data)
  - Fields: name, desc, bgColor, image (file)
  - Files are uploaded to Cloudinary
- **GET** `/api/album/list` - Get all albums
- **DELETE** `/api/album/remove` - Remove an album
  - Body: { id: "album_id" }

## File Uploads

Files (images and audio) are uploaded to **Cloudinary** cloud storage:
- Images are stored in `kodmusic/images` and `kodmusic/albums` folders
- Audio files are stored in `kodmusic/songs` folder
- Files are automatically deleted from Cloudinary when removed from database

## MongoDB Setup

If you don't have MongoDB installed locally, you can:

1. **Use MongoDB Atlas (Cloud)**:
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env`

2. **Install MongoDB locally**:
   - Download from https://www.mongodb.com/try/download/community
   - Install and run MongoDB service
   - Use default connection string: `mongodb://localhost:27017/kodmusic`

## Project Structure

```
backend/
├── config/
│   └── mongodb.js          # MongoDB connection
├── controllers/
│   ├── songController.js   # Song business logic
│   └── albumController.js  # Album business logic
├── middleware/
│   └── multer.js           # File upload handling
├── models/
│   ├── songModel.js        # Song schema
│   └── albumModel.js       # Album schema
├── routes/
│   ├── songRoute.js        # Song routes
│   └── albumRoute.js       # Album routes
├── uploads/                # Uploaded files directory
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── server.js               # Main entry point
└── README.md
```

## Testing

You can test the API using:
- The admin panel at `http://localhost:5173`
- Postman or similar API testing tools
- cURL commands

Example cURL for getting songs:
```bash
curl http://localhost:8000/api/song/list
```
