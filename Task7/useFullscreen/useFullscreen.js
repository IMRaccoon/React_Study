export const useFullscreen = (callback) => {
  const element = useRef();
  const runCallback = (bool) => {
    if (callback && typeof callback === 'function') {
      callback(bool);
    }
  };
  const triggerFullScreen = () => {
    if (element.current) {
      if (element.current.requestFullscreen) {
        element.current.requestFullscreen();
      } else if (element.current.mozRequestFullScreen) {
        element.current.mozRequestFullScreen();
      } else if (element.current.webkitRequestFullScreen) {
        element.current.webkitRequestFullScreen();
      } else if (element.current.msRequestFullscreen) {
        element.current.msRequestFullscreen();
      }
      runCallback(true);
    }
  };
  const exitFull = () => {
    document.exitFullscreen();
    runCallback(false);
  };
  return { element, triggerFullScreen, exitFull };
};
