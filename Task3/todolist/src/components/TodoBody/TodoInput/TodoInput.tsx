import React from 'react';
import './TodoInput.css';

const TodoInput: React.FC = () => {
  return (
    <div className="todoInput">
      <button>+</button>
      <input type="text" placeholder="What is your Plan??"></input>
    </div>
  );
};

export default TodoInput;
