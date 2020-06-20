import React from 'react';
import './App.css';

const useConfirm = (message = '', callback, rejection) => {
  if (typeof callback !== 'function') {
    return;
  }

  const confirmAction = () => {
    if (window.confirm(message)) {
      callback();
    } else {
      rejection();
    }
  };
  return confirmAction;
};

const App = () => {
  const deleteWord = () => console.log('Deleting the world');
  const abort = () => console.log('Aborted');
  const confirmDelete = useConfirm('are you sure', deleteWord, abort);
  return (
    <div className="App">
      <h1>Hi</h1>
      <button onClick={confirmDelete}>Delete the word</button>
    </div>
  );
};

export default App;
