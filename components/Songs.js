import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import Song from "./Song"

const Songs = () => {
  const playlist = useRecoilValue(playlistState)

  return (
    <div className="px-8 flex flex-col space-y-1 pb-20 text-white">
      {playlist?.tracks.items.map((song, idx) => (
        <Song key={song.track.id} song={song} order={idx} />
      ))}
    </div>
  )
}

export default Songs
