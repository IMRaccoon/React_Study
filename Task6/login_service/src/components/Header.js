import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Search } from '.';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Header extends Component {
  state = {
    search: false, // 이 state 값에 따라 검색창을 보이거나 안보이거나
  };

  toggleSearch = () => {
    this.setState({
      search: !this.state.search,
    });
  };

  render() {
    const loginButton = (
      <li>
        <Link to="/login">
          <i className="material-icons">vpn_key</i>
        </Link>
      </li>
    );

    const logoutButton = (
      <li>
        <a>
          <i className="material-icons" onClick={this.props.onLogout}>
            lock_open
          </i>
        </a>
      </li>
    );

    return (
      <div>
        <nav>
          <div className="nav-wrapper blue darken-1">
            <Link to="/" className="brand-logo center">
              MEMOPAD
            </Link>

            <ul>
              <li>
                <a onClick={this.toggleSearch}>
                  <i className="material-icons">search</i>
                </a>
              </li>
            </ul>

            <div className="right">
              <ul>{this.props.isLoggedIn ? logoutButton : loginButton}</ul>
            </div>
          </div>
        </nav>
        {this.state.search ? (
          <Search
            onClose={this.toggleSearch}
            onSearch={this.props.onSearch}
            usernames={this.props.usernames}
            history={this.props.history}
          />
        ) : undefined}
        <ReactCSSTransitionGroup
          transitionName="search"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.state.search ? (
            <Search
              onClose={this.toggleSearch}
              onSearch={this.props.onSearch}
              usernames={this.props.usernames}
              history={this.props.history}
            />
          ) : undefined}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  onLogout: PropTypes.func,
  usernames: PropTypes.array,
  onSearch: PropTypes.func,
  history: PropTypes.object,
};
Header.defaultProps = {
  isLoggedIn: false,
  onLogout: () => {
    console.error('logout function not defined');
  },
  usernames: [],
  onSearch: () => {
    console.error('search function not defined');
  },
  history: {},
};

export default Header;
