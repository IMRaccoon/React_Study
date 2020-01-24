import React from 'react';
import './TodoList.css';
import TodoItem from '../TodoItem.interface';

const TodoList: React.FC<TodoItem[]> = props => {
  const renderList = (todo_list: TodoItem[]) => {
    return todo_list.map(todo => (
      <div>
        <input type="checkbox"></input>
        <label>{todo.text}</label>
      </div>
    ));
  };

  return <div className="todoList">{renderList(props)}</div>;
};

export default TodoList;
