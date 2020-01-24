import React from 'react';
import TodoHeader from './components/TodoHeader/TodoHeader';
import TodoBody from './components/TodoBody/TodoBody';
import './Main.css';

const Main: React.FC = () => {
  return (
    <div className="contents">
      <TodoHeader />
      <TodoBody />
    </div>
  );
};

export default Main;
