import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
