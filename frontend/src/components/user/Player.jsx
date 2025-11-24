import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { PlayerContext } from '../../context/PlayerContext'

const Player = () => {

  const { track, seekBar, seekBg, playStatus, play, pause, time, previous, next, seekSong } = useContext(PlayerContext);

  return (
    <div className='h-[10%] bg-black grid grid-cols-3 items-center text-white px-4'>
      {/* Left Section - Song Info */}
      <div className='hidden lg:flex items-center gap-4 min-w-0'>
        <img className='w-14 h-14 rounded object-cover' src={track?.image || assets.spotify_logo} alt="" />
        <div className='min-w-0 max-w-[200px]'>
          <p className='truncate font-medium text-sm'>{track?.name || 'No song playing'}</p>
          <p className='text-xs text-gray-400 truncate'>{track?.desc || ''}</p>
        </div>
      </div>

      {/* Center Section - Player Controls (Always centered) */}
      <div className='flex flex-col items-center gap-1 justify-self-center w-full'>
        <div className='flex gap-4'>
          <img className='w-4 cursor-pointer' src={assets.shuffle_icon} alt="" />
          <img onClick={previous} className='w-4 cursor-pointer' src={assets.prev_icon} alt="" />
          {playStatus
            ? (<img onClick={pause} className='w-4 cursor-pointer' src={assets.pause_icon} alt="" />)
            : (<img onClick={play} className='w-4 cursor-pointer' src={assets.play_icon} alt="" />)
          }
          <img onClick={next} className='w-4 cursor-pointer' src={assets.next_icon} alt="" />
          <img className='w-4 cursor-pointer' src={assets.loop_icon} alt="" />
        </div>
        <div className='flex items-center gap-5 w-full max-w-[500px]'>
          <p className='text-xs'>{time.currentTime.minute}:{time.currentTime.second.toString().padStart(2, '0')}</p>
          <div ref={seekBg} onClick={seekSong} className='flex-1 h-1 bg-gray-300 rounded-full cursor-pointer'>
            <div ref={seekBar} className='h-full w-0 bg-green-800 rounded-full transition-all' />
          </div>
          <p className='text-xs'>{time.totalTime.minute}:{time.totalTime.second.toString().padStart(2, '0')}</p>
        </div>
      </div>

      {/* Right Section - Volume & Other Controls */}
      <div className='hidden lg:flex items-center gap-2 opacity-75 justify-self-end'>
        <img className='w-4' src={assets.play_icon} alt="" />
        <img className='w-4' src={assets.mic_icon} alt="" />
        <img className='w-4' src={assets.queue_icon} alt="" />
        <img className='w-4' src={assets.speaker_icon} alt="" />
        <img className='w-4' src={assets.volume_icon} alt="" />
        <div className='w-20 bg-slate-50 h-1 rounded'></div>
        <img className='w-4' src={assets.mini_player_icon} alt="" />
        <img className='w-4' src={assets.zoom_icon} alt="" />
      </div>
    </div>
  )
}

export default Player
