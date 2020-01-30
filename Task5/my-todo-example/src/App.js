import React from 'react';
import './App.css';
import LinkListTemplate from './components/LinkListTemplate';
import Form from './components/Form';
import LinkitemList from './components/LinkitemList';

class App extends React.Component {
  id = 3;

  state = {
    link: '',
    title: '',
    links: [
      {
        id: 0,
        url: 'https://naver.com',
        title: '네이버',
        count: 0,
      },
      {
        id: 1,
        url: 'https://google.com',
        title: '구글',
        count: 0,
      },
      {
        id: 2,
        url: 'https://daum.net',
        title: '다음',
        count: 0,
      },
    ],
  };

  handleCreate = () => {
    const { link, title, links } = this.state;
    this.setState({
      link: '',
      title: '',
      links: links.concat({
        id: this.id++,
        url: link,
        title: title,
        count: 0,
      }),
    });
  };

  handleChange = target => e => {
    this.setState({
      [target]: e.target.value,
    });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleCreate();
    }
  };

  handleRemove = e => {
    console.log(e.target)
  }

  render() {
    const { link, title, links } = this.state;
    const { handleChange, handleCreate, handleKeyPress, handleRemove } = this;

    return (
      <LinkListTemplate
        form={
          <Form
            link={link}
            title={title}
            onChange={handleChange}
            onCreate={handleCreate}
            onKeyPress={handleKeyPress}
          ></Form>
        }
        linkList={<LinkitemList links={links} onRemove={handleRemove}></LinkitemList>}
      ></LinkListTemplate>
    );
  }
}

export default App;
