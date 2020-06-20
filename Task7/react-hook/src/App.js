import React from 'react';
import './App.css';

const usePreventLeave = () => {
  const listener = (event) => {
    event.preventDefault();
    event.returnValue = '';
  };

  const enablePrevent = () => window.addEventListener('beforeunload', listener);
  const disablePrevent = () =>
    window.removeEventListener('beforeunload', listener);
  return [enablePrevent, disablePrevent];
};

const App = () => {
  const [protect, unprotect] = usePreventLeave();

  return (
    <div className="App">
      <h1>Hi</h1>
      <button onClick={protect}>Protect</button>
      <button onClick={unprotect}>Unprotect</button>
    </div>
  );
};

export default App;
