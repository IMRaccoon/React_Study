import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const useFullscreen = (callback) => {
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

const App = () => {
  const onFullS = (isFull) => {
    console.log(isFull ? 'We are full' : 'We are samll');
  };
  const { element, triggerFullScreen, exitFull } = useFullscreen(onFullS);
  return (
    <div className="App">
      <div ref={element}>
        <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" />
        <button onClick={exitFull}>exit fullscrenn</button>
      </div>
      <button onClick={triggerFullScreen}>Mae Full Screen</button>
    </div>
  );
};

export default App;
