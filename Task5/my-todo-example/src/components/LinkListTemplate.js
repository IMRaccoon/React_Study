import React from 'react';
import './LinkListTemplate.css';

const LinkListTemplate = ({ form, linkList }) => {
  return (
    <main className="link-list-template">
      <div className="title">URI which will read some day</div>
      <section className="form-wrapper">{form}</section>
      <section className="url-list-warpper">{linkList}</section>
    </main>
  );
};

export default LinkListTemplate;
