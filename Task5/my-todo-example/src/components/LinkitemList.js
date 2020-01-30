import React from 'react';
import './LinkitemList.css';

const LinkitemList = ({ links }) => {
  return <table><LinkName></LinkName><Listform links={links}></Listform></table>;
};

const Listform = ({ links }) => {
  return links.map(({ id, url, title, count }) => (
    <LinkItem
      key={id}
      url={url}
      title={title}
      count={count}
    ></LinkItem>
  ))
};

const LinkItem = ({ url, title, count }) => {
  return (
    <tr className="link-item">
      <td className="item-url">{url}</td>
      <td className="item-title">{title}</td>
      <td className="item-count">{count}</td>
    </tr>
  );
};


const LinkName = () => {
  return (
    <tr className="link-item" id="list-name">
      <th className="item-url" id="name-url">url</th>
      <th className="item-title">title</th>
      <th className="item-count">count</th>
    </tr>
  )
}

export default LinkitemList;
