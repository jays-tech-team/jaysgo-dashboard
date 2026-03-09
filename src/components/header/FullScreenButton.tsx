import { Expand, Minimize } from "lucide-react";
import { isFullscreen, toggleFullscreen } from "../../unities/fullScreen";
import { useState } from "react";

export function FullScreenButton() {
  const [_isFullScreen, setIsFullScreen] = useState(isFullscreen());
  function handleClick() {
    toggleFullscreen();
    setTimeout(function () {
      setIsFullScreen(isFullscreen());
    }, 200);
  }
  return (
    <button
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      onClick={handleClick}
    >
      {_isFullScreen ? <Minimize size={20} /> : <Expand size={20} />}
    </button>
  );
}
