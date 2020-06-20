import React, { useEffect } from 'react';
import './App.css';

const useBeforeLeave = (onBefore) => {
  if (!onBefore || typeof onBefore !== 'function') {
    return;
  }
  const handle = (event) => {
    const { clientY } = event;
    if (clientY <= 0) {
      onBefore();
    }
  };
  useEffect(() => {
    document.addEventListener('mouseleave', handle);
    return () => {
      document.removeEventListener('mouseleave', handle);
    };
  }, []);
};

const App = () => {
  const begForLife = () => console.log("please don't levae");
  useBeforeLeave(begForLife);
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
};

export default App;
