import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const useNetwork = (onChange) => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onChange === 'function') {
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);
    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offine', handleChange);
    };
  }, []);

  return status;
};

const App = () => {
  const handleNetwordChange = (online) => {
    console.log(online ? 'We Just want online' : 'we are offine');
  };
  const online = useNetwork(handleNetwordChange);
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
};

export default App;
