import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {

  static defaultProps = {
    ncols: 5,
    nrows: 5,
    chanceLightStartsOn: 0.0
  }

  constructor(props) { super(props);

    this.state = {  
      board: this.generateBoard(),
      hasWon: false
    }
    this.printCell = this.printCell.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    window.location.reload();
  }
  /** handle changing a cell: update board & determine if winner */
  generateBoard(){
    let copy = [];
    for(let i = 0; i<(this.props.ncols); i++){
      let inner = []
      for(let n = 0; n<(this.props.nrows); n++){
        inner.push(Math.random() < this.props.chanceLightStartsOn)
      }
      copy.push(inner)
    }
    return copy
  }

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
}

    function flipCells(){
      flipCell(y, x)
      flipCell(y, x-1)
      flipCell(y-1, x)
      flipCell(y, x+1)
      flipCell(y+1, x)
    }

    flipCells()  

    let hasWon = board.every(row => row.every(cell => !cell));

    this.setState({board, hasWon});
  }

  printCell(cell){
    return <Cell isLit={cell} flipCellsAroundMe={this.flipCellsAround} />
  }


  /** Render game board or winning message. */

  render() {
    if(this.state.hasWon){
      return (
      <section className="BoardWon">
        <h1>Congratulations!</h1>
        <button onClick={this.refresh} > Play Again! </button>
      </section>
      )
    }
    let tblBoard = [];
    for(let y = 0; y < this.props.nrows; y++){
      let row = [];
      for(let x = 0; x < this.props.ncols; x++){
        let coord = `${y}-${x}`
        row.push(<Cell isLit={this.state.board[y][x]} key={coord} flipCellsAroundMe={() => this.flipCellsAround(coord)} />)
      }
      tblBoard.push(<tr>{row}</tr>);
    }
    return(
      
      <table className="Board">
        <thead>
          <h1>Lights<span>Out</span></h1>
        </thead>
        <tbody>
          {tblBoard}
        </tbody>
      </table>
    )
  }
}


export default Board;
