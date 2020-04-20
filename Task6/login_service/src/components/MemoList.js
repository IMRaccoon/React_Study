import React, { Component } from 'react';
import Memo from './Memo';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class MemoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    const mapToComponents = (data) => {
      return data.map((memo, i) => {
        return (
          <Memo
            data={memo}
            ownership={memo.writer === this.props.currentUser}
            key={memo.id}
            index={i}
            onEdit={this.props.onEdit}
            onStar={this.props.onStar}
            currentUser={this.props.currentUser}
            onRemove={this.props.onRemove}
          />
        );
      });
    };

    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName="memo"
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={1000}
        >
          {mapToComponents(this.props.data)}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

MemoList.propTypes = {
  data: PropTypes.array,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onStar: PropTypes.func,
};

MemoList.defaultProps = {
  data: [],
  currentUser: '',
  onEdit: (id, index, contents) => {
    console.error('edit function not defined');
  },
  onRemove: (id, index) => {
    console.error('remove function not defined');
  },
  onStar: (id, index) => {
    console.error('star function not defined');
  },
};

export default MemoList;
