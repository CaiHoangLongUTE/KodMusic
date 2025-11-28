import express from 'express';
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    searchPlaylists
} from '../controllers/playlistController.js';
import upload from '../middleware/multer.js';

const playlistRouter = express.Router();

// Create new playlist
playlistRouter.post('/create', upload.fields([
    { name: 'image', maxCount: 1 }
]), createPlaylist);

// Get all playlists for a user
playlistRouter.get('/user/:userId', getUserPlaylists);

// Search playlists
playlistRouter.get('/search', searchPlaylists);

// Get playlist by ID with songs
playlistRouter.get('/:id', getPlaylistById);

// Update playlist
playlistRouter.put('/update/:id', upload.fields([
    { name: 'image', maxCount: 1 }
]), updatePlaylist);

// Delete playlist
playlistRouter.delete('/delete/:id', deletePlaylist);

// Add song to playlist
playlistRouter.post('/add-song', addSongToPlaylist);

// Remove song from playlist
playlistRouter.delete('/remove-song', removeSongFromPlaylist);

export default playlistRouter;
