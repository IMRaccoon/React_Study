import React from 'react';
import './LinkitemList.css';

const LinkitemList = ({ links, onRemove }) => {
  return <LinkName links={links} onRemove={onRemove} />
};

const Listform = ({ links, onRemove }) => {
  return links.map(({ id, url, title, count }) => (
    <LinkItem
      key={id}
      id={id}
      url={url}
      title={title}
      count={count}
      onRemove={onRemove}
    ></LinkItem>
  ))
};

const LinkItem = ({ url, title, count, onRemove, id }) => {
  return (
    <tr className="list-body">
      <td className="remove" onClick={() => onRemove(id)} >&times;</td>
      <td className="item-url">{url}</td>
      <td className="item-title">{title}</td>
      <td className="item-count">{count}</td>
    </tr>
  );
};


const LinkName = ({ links, onRemove }) => {
  return (
    <table className="link-item">
      <thead id="list-name">
        <tr>check</tr>
        <tr className="item-url" id="name-url">url</tr>
        <tr className="item-title">title</tr>
        <tr className="item-count">count</tr>
      </thead>
      <tbody id="list-body-wrapper">
        <Listform links={links} onRemove={onRemove}></Listform>
      </tbody>
    </table >
  )
}

export default LinkitemList;
