import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';

class Memo extends Component {
  state = {
    editMode: false,
    value: this.props.data.contents,
  };

  toggleEdit = () => {
    if (this.state.editMode) {
      const id = this.props.data.id;
      const index = this.props.index;
      const contents = this.state.value;

      return this.props.onEdit(id, index, contents).then(() => {
        this.setState({
          editMode: !this.state.editMode,
        });
      });
    }
    return this.setState({
      editMode: !this.state.editMode,
    });
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleRemove = () => {
    let id = this.props.data.id;
    let index = this.props.index;
    this.props.onRemove(id, index);
  };

  handleStar = () => {
    let id = this.props.data.id;
    let index = this.props.index;
    this.props.onStar(id, index);
  };

  componentDidUpdate() {
    // WHEN COMPONENT UPDATES, INITIALIZE DROPDOWN
    // (TRIGGERED WHEN LOGGED IN)
    $('#dropdown-button-' + this.props.data.id).dropdown({
      belowOrigin: true, // Displays dropdown below the button
    });
  }

  componentDidMount() {
    // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
    // (TRIGGERED WHEN REFRESHED)
    $('#dropdown-button-' + this.props.data.id).dropdown({
      belowOrigin: true, // Displays dropdown below the button
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let current = {
      props: this.props,
      state: this.state,
    };

    let next = {
      props: nextProps,
      state: nextState,
    };

    return JSON.stringify(current) !== JSON.stringify(next);
  }

  render() {
    const dropDownMenu = (
      <div className="option-button">
        <a
          className="dropdown-button"
          id={`dropdown-button-${this.props.data.id}`}
          data-activates={`dropdown-${this.props.data.id}`}
        >
          <i className="material-icons icon-button">more_vert</i>
        </a>
        <ul id={`dropdown-${this.props.data.id}`} className="dropdown-content">
          <li>
            <a onClick={this.toggleEdit}>Edit</a>
          </li>
          <li>
            <a onClick={this.handleRemove}>Remove</a>
          </li>
        </ul>
      </div>
    );
    // EDITED info (수정된 시간 -TimeAgo)
    let editedInfo = (
      <span style={{ color: '##AAB5BC' }}>
        · Edited <TimeAgo date={this.props.data.edited} live={true} />
      </span>
    );
    // IF IT IS STARRED ( CHECKS WHETHER THE NICKNAME EXISTS IN THE ARRAY )
    // RETURN STYLE THAT HAS A YELLOW COLOR
    let starStyle =
      JSON.parse(this.props.data.starred)?.indexOf(this.props.currentUser) > -1
        ? { color: '#ff9980' }
        : {};
    const memoView = (
      <div className="card">
        <div className="info">
          <Link to={`/wall/${this.props.data.writer}`} className="username">
            {this.props.data.writer}
          </Link>{' '}
          wrote a log · <TimeAgo date={this.props.data.created} />
          {this.props.data.is_edited ? editedInfo : undefined}
          {this.props.ownership ? dropDownMenu : undefined}
        </div>
        <div className="card-content">{this.props.data.contents}</div>
        <div className="footer">
          <i
            className="material-icons log-footer-icon star icon-button"
            style={starStyle}
            onClick={this.handleStar}
          >
            star
          </i>
          <span className="star-count">
            {JSON.parse(this.props.data.starred)?.length ?? 0}
          </span>
        </div>
      </div>
    );
    const editVeiw = (
      <div className="write">
        <div className="card">
          <div className="card-content">
            <textarea
              className="materialize-textarea"
              value={this.state.value}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="card-action">
            <a onClick={this.toggleEdit}>OK</a>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container memo">
        {this.state.editMode ? editVeiw : memoView}
      </div>
    );
  }
}

Memo.propTypes = {
  data: PropTypes.object,
  ownership: PropTypes.bool,
  onEdit: PropTypes.func,
  index: PropTypes.number,
  onStar: PropTypes.func,
  currentUser: PropTypes.string,
};

Memo.defaultProps = {
  data: {
    id: '0',
    writer: 'Writer',
    contents: 'Contents',
    is_edited: false,
    edited: new Date(),
    created: new Date(),
    starred: [],
  },
  ownership: true,
  onEdit: (id, index, contents) => {
    console.error('onEdit function not defined');
  },
  index: -1,
  onStar: (id, index) => {
    console.error('star function not defined');
  },
  currentUser: '',
};

export default Memo;
