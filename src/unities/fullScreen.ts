const doc = document as Document & {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozFullScreenElement?: Element;
  mozCancelFullScreen?: () => Promise<void>;
  msFullscreenElement?: Element;
  msExitFullscreen?: () => Promise<void>;
};
export function toggleFullscreen(
  element: HTMLElement = document.documentElement
): void {
  const el = element as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };

  if (isFullscreen()) {
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  } else {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }
}

export function isFullscreen(): boolean {
  return (
    !!doc.fullscreenElement ||
    !!doc.webkitFullscreenElement ||
    !!doc.mozFullScreenElement ||
    !!doc.msFullscreenElement
  );
}
