import express from 'express';
import { addAlbum, listAlbums, removeAlbum, searchAlbums } from '../controllers/albumController.js';
import upload from '../middleware/multer.js';

const albumRouter = express.Router();

// Add album - handles image file
albumRouter.post('/add', upload.fields([
    { name: 'image', maxCount: 1 }
]), addAlbum);

// List all albums
albumRouter.get('/list', listAlbums);

// Search albums
albumRouter.get('/search', searchAlbums);

// Remove album
albumRouter.delete('/remove', removeAlbum);

export default albumRouter;
