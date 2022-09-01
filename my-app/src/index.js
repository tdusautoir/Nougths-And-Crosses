import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

let WinnerSquare = [];

function Square(props) {
  if (
    props.id === WinnerSquare[0] ||
    props.id === WinnerSquare[1] ||
    props.id === WinnerSquare[2]
  ) {
    return (
      <button className="square active" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    if (this.props.onClick) {
      return (
        <Square
          id={i}
          value={this.props.squares[i]}
          onClick={() => {
            this.props.onClick(i);
          }}
        />
      );
    } else {
      return <Square id={i} value={this.props.squares[i]} />;
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    WinnerSquare = [];
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Back to step n°" + move : "Back to the start";
      return (
        <li key={move}>
          <button class="step" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
          <Board className="desc-board" squares={history[move].squares} />
        </li>
      );
    });

    let status;
    if (winner === 1) {
      status = "TIE";
    } else if (winner) {
      status = winner + " is the winner.";
    } else {
      status = "Next Player : " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <div className="history">
              <p>History :</p>
              <ol>{moves}</ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      WinnerSquare = [a, b, c];
      return squares[a]; //WINNER
    }
  }

  let count = 0;
  for (let x = 0; x < squares.length; x++) {
    if (squares[x]) {
      count++;
    }
  }
  if (count >= 9) {
    return 1; //TIE
  }

  return null;
}
