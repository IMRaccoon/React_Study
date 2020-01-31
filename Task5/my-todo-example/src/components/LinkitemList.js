import React from 'react';
import './LinkitemList.css';

const LinkitemList = ({ links, onRemove, onClick }) => {
  return <LinkName links={links} onRemove={onRemove} onClick={onClick} />
};

const Listform = ({ links, onRemove, onClick }) => {
  return links.map(({ id, url, title, count }) => (
    <LinkItem
      key={id}
      id={id}
      url={url}
      title={title}
      count={count}
      onRemove={onRemove}
      onClick={onClick}
    ></LinkItem>
  ))
};

const LinkItem = ({ url, title, count, onRemove, id, onClick }) => {
  return (
    <tr className="list-body">
      <td className="remove" onClick={() => onRemove(id)} >&times;</td>
      <td className="item-url" onClick={() => onClick(id)}>{url}</td>
      <td className="item-title">{title}</td>
      <td className="item-count">{count}</td>
    </tr>
  );
};


const LinkName = ({ links, onRemove, onClick }) => {
  return (
    <table className="link-item">
      <thead id="list-name">
        <tr className="list-name-check">check</tr>
        <tr className="list-name-url">url</tr>
        <tr className="list-name-title">title</tr>
        <tr className="list-name-count">count</tr>
      </thead>
      <tbody id="list-body-wrapper">
        <Listform links={links} onRemove={onRemove} onClick={onClick}></Listform>
      </tbody>
    </table >
  )
}

export default LinkitemList;
