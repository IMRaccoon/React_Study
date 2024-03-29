import React, { Component } from 'react';
import TodoListTemplate from './components/TodoListTemplate';
import Form from './components/Forms';
import TodoItemList from './components/TodoItemList';
import Palette from './components/Palette';

const colors = ['#343a40', '#f03e3e', '#12b886', '#228ae6'];

class App extends Component {
  id = 3; // 이미 0,1,2 가 존재하므로 3으로 설정

  state = {
    input: '',
    todos: [
      { id: 0, text: ' 리액트 소개', checked: false },
      { id: 1, text: ' 리액트 소개', checked: true },
      { id: 2, text: ' 리액트 소개', checked: false },
    ],
    color: '#343a40',
  };

  handleChange = e => {
    this.setState({
      input: e.target.value, // input 의 다음 바뀔 값
    });
  };

  handleCreate = () => {
    const { input, todos, color } = this.state;
    this.setState({
      input: '', // 인풋 비우고
      // concat 을 사용하여 배열에 추가
      todos: todos.concat({
        id: this.id++,
        text: input,
        checked: false,
        color: color,
      }),
    });
  };

  handleKeyPress = e => {
    // 눌려진 키가 Enter 면 handleCreate 호출
    if (e.key === 'Enter') {
      this.handleCreate();
    }
  };

  handleToggle = id => {
    const { todos } = this.state;
    const index = todos.findIndex(todo => todo.id === id);

    const selected = todos[index];

    this.setState({
      todos: [
        ...todos.slice(0, index),
        {
          ...selected,
          checked: !selected.checked,
        },
        ...todos.slice(index + 1, todos.length),
      ],
    });
  };

  handleRemove = id => {
    const { todos } = this.state;
    this.setState({
      todos: todos.filter(todo => todo.id !== id),
    });
  };

  handleSelectColor = color => {
    this.setState({
      color,
    });
  };

  render() {
    const { input, todos, color } = this.state;
    const {
      handleChange,
      handleCreate,
      handleKeyPress,
      handleToggle,
      handleRemove,
      handleSelectColor,
    } = this;

    return (
      <TodoListTemplate
        form={
          <Form
            value={input}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
            onCreate={handleCreate}
            color={color}
          />
        }
        palette={
          <Palette
            colors={colors}
            selected={color}
            onSelect={handleSelectColor}
          ></Palette>
        }
      >
        <TodoItemList
          todos={todos}
          onToggle={handleToggle}
          onRemove={handleRemove}
        />
      </TodoListTemplate>
    );
  }
}

export default App;
