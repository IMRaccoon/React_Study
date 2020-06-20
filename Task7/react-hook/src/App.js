import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const useNotification = (title, options) => {
  if (!('Notification' in window)) {
    return;
  }

  const fireNotif = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, options);
        } else {
          return;
        }
      });
    } else {
      new Notification(title, options);
    }
  };

  return fireNotif;
};

const App = () => {
  const triggerNotif = useNotification('Can I get Notification', {
    body: 'I Shit',
  });
  return (
    <div className="App">
      <buttonL onClick={triggerNotif}>Hi</buttonL>
    </div>
  );
};

export default App;
