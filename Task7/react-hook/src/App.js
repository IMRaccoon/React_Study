import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const potato = useRef();

  setTimeout(() => {
    if (!!potato.current) {
      return potato.current.focus();
    }
  }, 1000);

  return (
    <div className="App">
      <h1>Hi</h1>
      <input ref={potato} placeholder="la" />
    </div>
  );
};

export default App;
