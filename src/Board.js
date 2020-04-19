import React, {Component} from 'react';
import Cell from './Cell';
import './Board.css';

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 1,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasWon: false,
      board: this.createBoard(),
      moves: 0,
    };

    this.restart = this.restart.bind(this);
  }

  createBoard() {
    let board = [];

    for (let y=0; y < this.props.nrows; y++) {
      let row = [];
      for (let x=0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }

    return board;
  }

  // handle changing a cell: update board & determine if winner
  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split('-').map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // Flip this cell and the cells around it
    flipCell(y, x); // flip initial cell
    flipCell(y, x - 1); // flip left
    flipCell(y, x + 1); // flip right
    flipCell(y - 1, x); // flip above
    flipCell(y + 1, x); // flip below

    // win when every cell is turned off
    // determine if the game has been won
    let hasWon = board.every(row => row.every(cell => !cell));

    // this.setState({ board, hasWon });
    this.setState((st) => {
      return {
        board,
        hasWon,
        moves: st.moves + 1
      };
    });
  }

  restart() {
    this.setState({ board: this.createBoard(), hasWon: false, moves: 0 });
  }

  makeTable() {
    let tblBoard = [];
    for (let y=0; y < this.props.nrows; y++) {
      let row = [];
      for (let x=0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}
            isLit={this.state.board[y][x]}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
      }
      tblBoard.push(<tr key={y}>{row}</tr>);
    }

    return (
      <table className="Board">
        <tbody>{tblBoard}</tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        { this.state.hasWon ? (
          <div className="Board-title">
            <div className="winner">
              <span className="neon-orange">You</span>
              <span className="neon-blue">Won!</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="Board-title">
              <div className="neon-orange">Lights</div>
              <div className="neon-blue">Out</div>
            </div>
            {this.makeTable()}
          </div>
        )}
        <button className="Board-restart" onClick={this.restart}>Restart</button>
        <div className="Board-moves">Moves: {this.state.moves}</div>
      </div>
    );
  }
}

export default Board;
