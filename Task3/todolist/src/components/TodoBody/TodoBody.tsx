import React from 'react';
import './TodoBody.css';
import TodoInput from './TodoInput/TodoInput';
import TodoItem from './TodoItem.interface';
import TodoList from './TodoList/TodoList';

const test: TodoItem[] = [
  { text: 'first', done: false },
  { text: 'second', done: false },
  { text: 'third', done: false },
];

const TodoBody: React.FC = () => {
  return (
    <div className="body">
      <TodoInput />
      <TodoList {...test} />
    </div>
  );
};

export default TodoBody;
