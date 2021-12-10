import { VolumeUpIcon as VolumeDownIcon, HeartIcon } from "@heroicons/react/outline"
import { RewindIcon, PlayIcon, SwitchHorizontalIcon, FastForwardIcon, PauseIcon, ReplyIcon, VolumeUpIcon } from "@heroicons/react/solid"
import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { useRecoilState } from "recoil"
import { currentTrackState, isPlayingState } from "../atoms/songAtom"
import useSongInfo from "../hooks/useSongInfo"
import useSpotify from "../hooks/useSpotify"
import { debounce } from 'lodash'

const Player = () => {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()

  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState)

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const [volume, setVolume] = useState(50)
  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        setCurrentTrack(data.body?.item?.id)
        spotifyApi.getMyCurrentPlaybackState().then(data => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrack) {
      fetchCurrentSong()
    }
  }, [currentTrack, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      adjustVolume(volume)
    }
  }, [volume])

  const adjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch(err => { })
    }, 500), []
  )

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false)
      } else {
        spotifyApi.play();
        setIsPlaying(true)
      }
    })
  }

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:mx-0">
      <div className="flex items-center space-x-4">
        <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images?.[0]?.url} alt="Image" />
        <div>
          <h1>{songInfo?.name}</h1>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />

        {isPlaying ?
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
          :
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        }

        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end py-5">
        <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button" />
        <input
          className="w-14 md:w-20"
          type="range"
          value={volume}
          onChange={(e) => setVolume(+e.target.value)}
          min={0}
          max={100}
        />
        <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
      </div>
    </div>
  )
}

export default Player
