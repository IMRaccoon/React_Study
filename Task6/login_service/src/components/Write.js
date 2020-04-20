import React, { Component } from 'react';
import PropsTypes from 'prop-types';

class Write extends Component {
  state = {
    contents: '',
  };

  handleChange = (e) =>
    this.setState({
      contents: e.target.value,
    });

  handlePost = () => {
    const { contents } = this.state;
    this.props.onPost(contents).then(() =>
      this.setState({
        contents: '',
      }),
    );
  };

  render() {
    return (
      <div className="container write">
        <div className="card">
          <div className="card-content">
            <textarea
              className="materialize-textarea"
              placeholder="Write down your memo"
              onChange={this.handleChange}
              value={this.state.contents}
            ></textarea>
          </div>
          <div className="card-action">
            <a onClick={this.handlePost}>POST</a>
          </div>
        </div>
      </div>
    );
  }
}

Write.PropsTypes = {
  onPost: PropsTypes.func,
};
Write.defaultProps = {
  onPost: (contents) => {
    console.error('post function not defined');
  },
};

export default Write;
