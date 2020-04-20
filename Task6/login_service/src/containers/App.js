import React, { Component } from 'react';
import { Header } from '../components';
import {
  getStatusRequest,
  logoutRequest,
  logout,
} from '../actions/authentication';
import { connect } from 'react-redux';
import { searchRequest } from '../actions/search';

class App extends Component {
  componentDidMount() {
    // get cookie by name
    function getCookie(name) {
      let value = '; ' + document.cookie;
      let parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
        return parts.pop().split(';').shift();
      }
    }
    // get loginData from cookie
    let loginData = getCookie('key');

    // if loginData is undefined, do nothing
    if (typeof loginData === 'undefined') return;

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));

    // if not logged in, do nothing
    if (!loginData.isLoggedIn) return;

    // page refreshed & has a session in cookie
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(() => {
      // if session is not valid
      if (!this.props.status.valid) {
        loginData = {
          isLoggedIn: false,
          username: '',
        };

        document.cookie = 'key=' + btoa(JSON.stringify(loginData));

        // and notify
        let $toastContent = $(
          '<span style="color: #FFB4BA">Your session is expired, please log in again</span>',
        );
        Materialize.toast($toastContent, 4000);
      }
    });
  }

  handleLogout = () => {
    this.props.logoutRequest().then(() => {
      Materialize.toast('Good Bye!', 2000);
      let loginData = {
        isLoggedIn: false,
        username: '',
      };

      document.cookie = 'key=' + btoa(JSON.stringify(loginData));
    });
  };

  handleSearch = (keyword) => {
    this.props.searchRequest(keyword);
  };

  render() {
    /** Check whether current route is login or register using regex */
    let re = /(login|register)/;
    let isAuth = re.test(this.props.location.pathname);

    return (
      <div>
        {isAuth ? undefined : (
          <Header
            isLoggedIn={this.props.status.isLoggedIn}
            onLogout={this.handleLogout}
            onSearch={this.handleSearch}
            usernames={this.props.searchResults}
            history={this.props.history}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  status: state.authentication.status,
  searchResults: state.search.usernames,
});

const mapDispatchToProps = (dispatch) => ({
  getStatusRequest: () => dispatch(getStatusRequest()),
  logoutRequest: () => dispatch(logoutRequest()),
  searchRequest: (keyword) => dispatch(searchRequest(keyword)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
