import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./MusicPlayer.css";

const MusicPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    },
    pause: () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    },
    toggle: toggleMusic
  }));

  return (
    <div className="music-container">
      <audio ref={audioRef} loop src="/images/public_music.mp3" preload="auto" />
      <button
        className="music-control"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? "⏸ Pause Music" : "🎵 Play Music"}
      </button>
    </div>
  );
});

MusicPlayer.displayName = "MusicPlayer";
export default MusicPlayer;