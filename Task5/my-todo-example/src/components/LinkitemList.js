import React from 'react';
import './LinkitemList.css';

const LinkitemList = ({ links }) => {
  const listform = links.map(({ id, url, title, count, checked }) => (
    <LinkItem
      key={id}
      url={url}
      title={title}
      count={count}
      checked={checked}
    ></LinkItem>
  ));
  return listform;
};

const LinkItem = ({ url, title, count, checked }) => {
  console.log(url);
  return (
    <ol className="link-item">
      <div className="item-url">{url}</div>
      <div className="item-title">{title}</div>
      <div className="item-count">{count}</div>
    </ol>
  );
};

export default LinkitemList;
