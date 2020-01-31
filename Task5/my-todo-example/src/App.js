import React from 'react';
import './App.css';
import LinkListTemplate from './components/LinkListTemplate';
import Form from './components/Form';
import LinkitemList from './components/LinkitemList';
import * as isReachable from 'is-reachable';
import * as ogs from 'open-graph-scraper'
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

  handleCreate = async () => {
    const { link, title, links } = this.state;
    let check_valid = link.concat();
    if (check_valid === '') {
      alert('URL은 필수값입니다.')
      return;
    }
    check_valid = await isValidURL(check_valid);

    if (!check_valid) {
      alert('존재하지 않는 URL 입니다.');
      return;
    }

    if (links.find(link => link.url === check_valid)) {
      alert('같은 URL이 존재합니다.');
      return;
    }

    ogs({ 'url': check_valid, 'encoding': 'utf8' }, (err, results) => {
      console.log('res: ' + results[2]);
      console.log('err: ' + err);
    })

    this.setState({
      link: '',
      title: '',
      links: links.concat({
        id: this.id++,
        url: check_valid,
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

  handleRemove = (id) => {
    this.setState({
      links: this.state.links.filter(link => link.id !== id)
    })
  }

  handleClick = (id) => {
    const copy_links = this.state.links.concat();
    const targetIndex = copy_links.findIndex(link => link.id === id);
    copy_links[targetIndex].count += 1;
    window.open(copy_links[targetIndex].url);

    this.setState({
      links: copy_links,
    })
  }

  render() {
    const { link, title, links } = this.state;
    const { handleChange, handleCreate, handleKeyPress, handleRemove, handleClick } = this;

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
        linkList={<LinkitemList links={links} onRemove={handleRemove} onClick={handleClick}></LinkitemList>}
      ></LinkListTemplate>
    );
  }
}

async function isValidURL(link) {
  let tmp_link = link.concat();
  const http_index = tmp_link.indexOf('//');
  // remove 'http://' or 'https://'
  if (http_index !== -1) {
    tmp_link = tmp_link.slice(http_index + 2);
  }
  // slice 'example.com/~~/~~' to 'example.com'
  const dir_index = tmp_link.indexOf('/');
  if (dir_index !== -1) {
    tmp_link = tmp_link.slice(0, dir_index);
  }
  if (await isReachable(tmp_link)) {
    return 'https://' + tmp_link;
  }
  return false;
}

export default App;
