import React, { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause } from "react-icons/fi";

// --- CUSTOM AUDIO PLAYER ---
const SimpleRecordingPlayer = ({ audioUrl, senderRole }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const isAdmin = senderRole === "admin";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => setDuration(audio.duration);
    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full min-w-[240px] p-1">
      <button
        onClick={togglePlayPause}
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
          isAdmin ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
        }`}
      >
        {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} className="ml-0.5" />}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        <div 
          className={`w-full rounded-full h-1.5 cursor-pointer relative ${isAdmin ? "bg-white/30" : "bg-gray-300"}`} 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = percent * duration;
          }}
        >
          <div 
            className={`h-1.5 rounded-full ${isAdmin ? "bg-white" : "bg-indigo-600"}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className={`flex justify-between text-[10px] ${isAdmin ? "text-white/80" : "text-gray-500"}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

// --- MEDIA CLASSIFIER ---
const MediaMessage = ({ text, senderRole }) => {
  // Regex to detect JPG or MP3 endpoints accurately
  const imageRegex = /https?:\/\/.*\.(?:jpg|jpeg|png|webp)(\?.*)?$/i;
  const audioRegex = /https?:\/\/.*\.(?:mp3|mp4|wav|m4a|aac)(\?.*)?$/i;

  if (imageRegex.test(text)) {
    return (
      <img src={text} alt="Shared" className="max-w-full rounded-lg shadow-sm block max-h-[300px] object-contain" />
    );
  }

  if (audioRegex.test(text)) {
    return <SimpleRecordingPlayer audioUrl={text} senderRole={senderRole} />;
  }

  return <p className="text-[15px] px-2 py-1">{text}</p>;
};

export default MediaMessage;