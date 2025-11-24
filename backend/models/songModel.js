import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  album: {
    type: String,
    default: 'none'
  },
  image: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Song = mongoose.model('Song', songSchema);

export default Song;
