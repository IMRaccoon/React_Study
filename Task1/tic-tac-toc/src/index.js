import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const BlockSize = 9;

function Square(props) {
  return (
    <button
      className="square"
      id={props.isWin ? 'winner' : ''}
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(BlockSize).fill(null),
      xIsNext: true,
    };
  }

  hightlight(i) {
    if (this.props.style.isClicked === i) {
      if (this.props.style.xIsNext) {
        return {
          border: '3px solid red',
        };
      }
      return {
        border: '3px solid blue',
      };
    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={this.hightlight(i)}
        isWin={this.props.winner ? this.props.winner.includes(i) : null}
      />
    );
  }

  renderSquareBundle(row) {
    return (
      <div className="board-row">
        {this.renderSquare(row * 3)}
        {this.renderSquare(row * 3 + 1)}
        {this.renderSquare(row * 3 + 2)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderSquareBundle(0)}
        {this.renderSquareBundle(1)}
        {this.renderSquareBundle(2)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(BlockSize).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isClicked: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (this.state.isClicked === i) {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([
          {
            squares,
          },
        ]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        isClicked: null,
      });
    } else {
      this.setState({
        isClicked: i,
      });
    }
  }

  jumpTo(step) {
    this.setState({
      history: this.state.history.slice(0, step + 1),
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = [];

    history.forEach((_, move) => {
      const desc = move
        ? `Go to move #${move}, history : ${move % 2 ? 'X' : 'O'}`
        : 'Go to game start';
      moves.push(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>,
      );
    });

    let status;
    if (Array.isArray(winner)) {
      status = 'Winner: ' + (this.xIsNext ? 'O' : 'X');
    } else if (winner) {
      status = 'Draw...';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-start">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            style={{
              isClicked: this.state.isClicked,
              xIsNext: this.state.xIsNext,
            }}
            winner={Array.isArray(winner) ? winner : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            className="order"
            onClick={() => this.setState({ isAsc: !this.state.isAsc })}
          >
            {this.state.isAsc ? 'Descending' : 'Ascending'}
          </button>
          <ol>{this.state.isAsc ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  let isFull = true;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return [a, b, c];
    } else if (!squares[a] || !squares[b] || !squares[c]) {
      isFull = false;
    }
  }
  return isFull;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
