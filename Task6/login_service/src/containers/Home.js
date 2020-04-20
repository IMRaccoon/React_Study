import React, { Component } from 'react';
import { Write, MemoList } from '../components';
import {
  memoPostRequest,
  memoListRequest,
  memoEditRequest,
  memoRemoveRequest,
  memoStarRequest,
} from '../actions/memo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Home extends Component {
  state = {
    loadingState: false,
    initiallyLoaded: false,
  };

  loadNewMemo() {
    // CANCEL IF THERE IS A PENDING REQUEST
    if (this.props.listStatus === 'WAITING') {
      return new Promise((resolve, reject) => resolve());
    }

    // IF PAGE IS EMPTY, DO THE INITIAL LOADING
    if (this.props.memoData.length === 0) {
      return this.props.memoListRequest(
        true,
        undefined,
        undefined,
        this.props.username,
      );
    }
    return this.props.memoListRequest(false, 'new', this.props.memoData[0].id);
  }

  loadOldMemo = () => {
    // CANCEL IF USER IS READING THE LAST PAGE
    if (this.props.isLast) {
      return new Promise((resolve, reject) => resolve());
    }

    // GET ID OF THE MEMO AT THE BOTTOM
    let lastId = this.props.memoData[this.props.memoData.length - 1].id;

    // START REQUEST
    return this.props
      .memoListRequest(false, 'old', lastId, this.props.username)
      .then(() => {
        // IF IT IS LAST PAGE, NOTIFY
        if (this.props.isLast) {
          Materialize.toast('You are reading the last page', 2000);
        }
      });
  };

  componentDidMount() {
    // LOAD NEW MEMO EVERY 5 SECONDS
    const loadMemoLoop = () => {
      this.loadNewMemo().then(
        () => (this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000)),
      );
    };

    const loadUntilScrollable = () => {
      // IF THE SCROLLBAR DOES NOT EXIST,
      if ($('body').height() < $(window).height()) {
        this.loadOldMemo().then(() => {
          // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
          if (!this.props.isLast) {
            loadUntilScrollable();
          }
        });
      }
    };

    this.props
      .memoListRequest(true, undefined, undefined, this.props.username)
      .then(() => {
        // LOAD MEMO UNTIL SCROLLABLE
        setTimeout(loadUntilScrollable, 1000);
        // BEGIN NEW MEMO LOADING LOOP
        loadMemoLoop();
        this.setState({
          initiallyLoaded: true,
        });
      });

    $(window).scroll(() => {
      // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
      if (
        $(document).height() - $(window).height() - $(window).scrollTop() <
        250
      ) {
        if (!this.state.loadingState) {
          this.loadOldMemo();
          this.setState({
            loadingState: true,
          });
        }
      } else {
        if (this.state.loadingState) {
          this.setState({
            loadingState: false,
          });
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // 컴포넌트가 업데이트 된 이후에 현재 프롭스로 전달된 usernam과 이전 프롭스로 전달된 username 이 다르면
    // unmount, didmount 실행
    if (this.props.username !== prevProps.username) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    // STOPS THE loadMemoLoop
    clearTimeout(this.memoLoaderTimeoutId);

    // REMOVE WINDOWS SCROLL LISTENER
    $(window).unbind();

    this.setState({
      initiallyLoaded: false,
    });
  }

  handlePost = (contents) => {
    return this.props.memoPostRequest(contents).then(() => {
      if (this.props.postStatus.status === 'SUCCESS') {
        this.loadNewMemo().then(() => Materialize.toast('Success!', 2000));
      } else {
        /*
          ERROR CODES
              1: NOT LOGGED IN
              2: CONTENTS IS NOT STRING
              3: EMPTY CONTENTS
        */
        let $toastContent;
        switch (this.props.postStatus.error) {
          case 1:
            $toastContent = $(
              '<span style="color: #FFB4BA">You are not logged in</span>',
            );
            Materialize.toast($toastContent, 2000);
            setTimeout(() => {
              location.reload(false);
            }, 2000);
            break;
          case 2:
            $toastContent = $(
              '<span style="color: #FFB4BA">Contents should be string</span>',
            );
            Materialize.toast($toastContent, 2000);
            break;
          case 3:
            $toastContent = $(
              '<span style="color: #FFB4BA">Please write Something</span>',
            );
            Materialize.toast($toastContent, 2000);
            break;
          default:
            $toastContent = $(
              '<span style="color: #FFB4BA">Something Broke</span>',
            );
            Materialize.toast($toastContent, 2000);
            break;
        }
      }
    });
  };

  handleEdit = (id, index, contents) => {
    return this.props.memoEditRequest(id, index, contents).then(() => {
      if (this.props.editStatus.status === 'SUCCESS') {
        Materialize.toast('Success!', 2000);
      } else {
        /*
          ERROR CODES
              1: INVALID ID,
              2: CONTENTS IS NOT STRING
              3: EMPTY CONTENTS
              4: NOT LOGGED IN
              5: NO RESOURCE
              6: PERMISSION FAILURE
        */
        let errorMessage = [
          'Something broke',
          'Contents should be string',
          'Please write something',
          'You are not logged in',
          'That memo does not exist anymore',
          'You do not have permission',
        ];

        let error = this.props.editStatue.error;

        // NOTIFY ERROR
        let $toastContent = $(
          '<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>',
        );
        Materialize.toast($toastContent, 2000);

        // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2SECONDS
        if (error === 4) {
          setTimeout(() => {
            location.reload(false);
          }, 2000);
        }
      }
    });
  };

  handleRemove = (id, index) => {
    this.props.memoRemoveRequest(id, index).then(() => {
      if (this.props.removeStatus.status === 'SUCCESS') {
        // LOAD MORE MEMO IF THERE IS NO SCROLLBAR
        // 1 SECOND LATER. (ANIMATION TAKES 1SEC)
        // 메모를 지우는 통신을 성공하고 1초 뒤에 스크롤이 있는지 확인 => 없으면 전 메모 불러와 스크롤 생성
        setTimeout(() => {
          if ($('body').height() < $(window).height()) {
            this.loadOldMemo();
          }
        }, 1000);
      } else {
        // ERROR
        /*
          DELETE MEMO: DELETE /api/memo/:id
          ERROR CASES
            1: INVALID ID
            2: NOT LOGGED IN
            3: NO RESOURCE
            4. PERMISSION FAILRUE
        */
        let errorMessage = [
          'Something broke',
          'You are not logged in',
          'That memo does not exist',
          'You do not have permission',
        ];

        // NOTIFY ERROR
        let $toastContent = $(
          '<span style="color: #FFB4BA">' +
            errorMessage[this.props.removeStatus.error - 1] +
            '</span>',
        );
        Materialize.toast($toastContent, 2000);

        // IF NOT LOGGED IN, REFRESH THE PAGE
        if (this.props.removeStatus.error === 2) {
          setTimeout(() => {
            location.reload(false);
          }, 2000);
        }
      }
    });
  };

  handleStar = (id, index) => {
    this.props.memoStarRequest(id, index).then(() => {
      if (this.props.starStatus.status !== 'SUCCESS') {
        /*
          TOGGLES STAR OF MEMO: POST /api/memo/star/:id
          ERROR CODES
            1: INVALID ID
            2: NOT LOGGED IN
            3: NO RESOURCE
        */
        let errorMessage = [
          'Something broke',
          'You are not logged in',
          'That memo does not exist',
        ];

        // NOTIFY ERROR
        let $toastContent = $(
          '<span style="color: #FFB4BA">' +
            errorMessage[this.props.starStatus.error - 1] +
            '</span>',
        );
        Materialize.toast($toastContent, 2000);

        // IF NOT LOGGED IN, REFRESH THE PAGE
        if (this.props.starStatus.error === 2) {
          setTimeout(() => {
            location.reload(false);
          }, 2000);
        }
      }
    });
  };

  render() {
    const write = <Write onPost={this.handlePost} />;

    const emptyView = (
      <div className="container">
        <div className="emtpy-page">
          <b>{this.props.username}</b> isn't registered or hasn't written any
          memo
        </div>
      </div>
    );

    const wallHeader = (
      <div>
        <div className="container wall-info">
          <div className="card wall-info blue lighten-2 white-text">
            <div className="card-content">{this.props.username}</div>
          </div>
        </div>
        {this.props.memoData.length === 0 && this.state.initiallyLoaded
          ? emptyView
          : undefined}
      </div>
    );

    return (
      <div className="wrapper">
        {typeof this.props.username !== 'undefined' ? wallHeader : undefined}
        {this.props.isLoggedIn && typeof this.props.username === 'undefined'
          ? write
          : undefined}
        <MemoList
          data={this.props.memoData}
          currentUser={this.props.currentUser}
          onEdit={this.handleEdit}
          onRemove={this.handleRemove}
          onStar={this.handleStar}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.authentication.status.isLoggedIn,
  postStatus: state.memo.post,
  currentUser: state.authentication.status.currentUser,
  memoData: state.memo.list.data,
  listStatus: state.memo.list.status,
  isLast: state.memo.list.isLast,
  editStatus: state.memo.edit,
  removeStatus: state.memo.remove,
  starStatus: state.memo.star,
});

const mapDispatchToProps = (dispatch) => ({
  memoPostRequest: (contents) => dispatch(memoPostRequest(contents)),
  memoListRequest: (isInitial, listType, id, username) =>
    dispatch(memoListRequest(isInitial, listType, id, username)),
  memoEditRequest: (id, index, contents) =>
    dispatch(memoEditRequest(id, index, contents)),
  memoRemoveRequest: (id, index) => dispatch(memoRemoveRequest(id, index)),
  memoStarRequest: (id, index) => dispatch(memoStarRequest(id, index)),
});

Home.propTypes = {
  username: PropTypes.string,
};
Home.defaultProps = {
  username: undefined,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
