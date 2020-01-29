import React from 'react';
import './App.css';
import LinkListTemplate from './components/LinkListTemplate';
import Form from './components/Form';
import LinkitemList from './components/LinkitemList';

class App extends React.Component {
  id = 3;

  state = {
    input: {
      link: '',
      title: '',
    },
    links: [
      {
        id: 0,
        url: 'https://naver.com',
        title: '네이버',
        count: 0,
        checked: false,
      },
      {
        id: 1,
        url: 'https://google.com',
        title: '구글',
        count: 0,
        checked: false,
      },
      {
        id: 2,
        url: 'https://daum.net',
        title: '다음',
        count: 0,
        checked: false,
      },
    ],
  };

  handleCreate = () => {
    const { input, links } = this.state;

    this.setState({
      input: { link: '', title: '' },
      links: links.concat({
        id: this.id++,
        url: input.link,
        title: input.title,
        count: 0,
        checked: false,
      }),
    });
  };

  handleChange = target => e => {
    this.setState({
      input: {
        [target]: e.target.value,
      },
    });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleCreate();
    }
  };

  render() {
    const { input, links } = this.state;
    const { handleChange, handleCreate, handleKeyPress } = this;

    return (
      <LinkListTemplate
        form={
          <Form
            value={input}
            onChange={handleChange}
            onCreate={handleCreate}
            onKeyPress={handleKeyPress}
          ></Form>
        }
        linkList={<LinkitemList links={links}></LinkitemList>}
      ></LinkListTemplate>
    );
  }
}

export default App;
