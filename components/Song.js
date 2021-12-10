import { useRecoilState } from 'recoil'
import { currentTrackState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'
import { time } from '../lib/time'

const Song = ({ order, song }) => {
  const spotifyApi = useSpotify()
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrack(song.track.id)
    setIsPlaying(true)
    spotifyApi.play({
      uris: [song.track.uri]
    })
  }

  return (
    <div
      onClick={playSong}
      className='grid grid-cols-2 text-gray-500 hover:bg-gray-900 rounded-lg cursor-pointer py-4 px-5'>
      <div className='flex items-center space-x-4'>
        <p>{order + 1}</p>
        <img src={song.track.album.images[0].url} alt="" className="h-10 w-10" />
        <div>
          <p className='w-36 lg:w-64 truncate text-white'>{song.track.name}</p>
          <p className='w-40'>{song.track.artists[0].name}</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='hidden md:inline w-40 '>{song.track.album.name}</p>
        <p>{time(song.track.duration_ms)}</p>
      </div>
    </div>
  )
}

export default Song
