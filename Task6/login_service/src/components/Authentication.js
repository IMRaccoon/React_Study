import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Authentication extends Component {
  state = {
    username: '',
    password: '',
  };

  handleKeyPress = (e) => {
    if (e.charCode == 13) {
      if (this.props.mode) {
        this.handleLogin();
      } else {
        this.handleRegister();
      }
    }
  };

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  handleRegister = () => {
    const { username, password } = this.state;
    this.props
      .onRegister(username, password)
      .then((res) =>
        !res ? this.setState({ username: '', password: '' }) : null,
      );
  };

  handleLogin = () => {
    const { username, password } = this.state;
    this.props.onLogin(username, password).then((success) => {
      if (!success) {
        this.setState({
          password: '',
        });
      }
    });
  };

  render() {
    const inputBoxes = (
      <div>
        <div className="input-field col s12 username">
          <label>Username</label>
          <input
            name="username"
            type="text"
            className="validate"
            onChange={this.handleChange}
            value={this.state.username}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div className="input-field col s12">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="validate"
            onChange={this.handleChange}
            value={this.state.password}
            onKeyPress={this.handleKeyPress}
          />
        </div>
      </div>
    );

    const loginView = (
      <div>
        <div className="card-content">
          <div className="row">
            {inputBoxes}
            <a
              className="waves-effect waves-light btn"
              onClick={this.handleLogin}
            >
              SUBMIT
            </a>
          </div>
        </div>

        <div className="footer">
          <div className="card-content">
            <div className="right">
              New Here? <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    );

    const registerView = (
      <div className="card-content">
        <div className="row">
          {inputBoxes}
          <a
            className="waves-effect waves-light btn"
            onClick={this.handleRegister}
          >
            CREATE
          </a>
        </div>
      </div>
    );
    return (
      <div className="container auth">
        <Link className="logo" to="/">
          MEMOPAD
        </Link>
        <div className="card">
          <div className="header blue white-text center">
            <div className="card-content">
              {this.props.mode ? 'LOGIN' : 'REGISTER'}
            </div>
          </div>
          {this.props.mode ? loginView : registerView}
        </div>
      </div>
    );
  }
}

Authentication.propTypes = {
  mode: PropTypes.bool,
  onRegister: PropTypes.func,
  onLogin: PropTypes.func,
};
Authentication.defaultProps = {
  mode: true,
  onRegister: (id, pw) => {
    console.error('register function is not defined');
  },
  onLogin: (id, pw) => {
    console.error('login function is not defined');
  },
};

export default Authentication;
