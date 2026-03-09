import React, { useEffect, useRef } from "react";

interface NotificationAudioProps {
  src?: string;
}

const NotificationAudio: React.FC<NotificationAudioProps> = ({
  src = "/audio/order_notifier.mp3",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalPlay = 30000;

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  useEffect(() => {
    // Trigger initial play
    playAudio();

    // Set up interval for playing every 10 seconds
    const intervalId = setInterval(() => {
      playAudio();
    }, intervalPlay);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.pause();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={src} hidden />
    </>
  );
};

export default NotificationAudio;
