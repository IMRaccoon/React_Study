import React from 'react';
import './Form.css';

const Form = ({ onCreate, onChange, link, title, onKeyPress }) => (
  <div className="form">
    <input
      className="input-url"
      value={link}
      onChange={onChange('link')}
      onKeyPress={onKeyPress}
      placeholder="url을 입력하세요"
    ></input>
    <input
      className="input-title"
      value={title}
      onChange={onChange('title')}
      onKeyPress={onKeyPress}
      placeholder="title을 입력하세요"
    ></input>
    <div className="create-button" onClick={onCreate}>
      추가
    </div>
  </div>
);

export default Form;
