import express from 'express';
import { addSong, listSongs, removeSong, searchSongs } from '../controllers/songController.js';
import upload from '../middleware/multer.js';

const songRouter = express.Router();

// Add song - handles both image and audio files
songRouter.post('/add', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), addSong);

// List all songs
songRouter.get('/list', listSongs);

// Search songs
songRouter.get('/search', searchSongs);

// Remove song
songRouter.delete('/remove', removeSong);

export default songRouter;
