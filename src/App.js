import { useState } from "react";


function Square({value, onSquareClick, winnerSquare}) {

  return <button className={winnerSquare? "square winner":"square"} onClick={onSquareClick}>{value}</button>;
}

export function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) 
  {
    if(squares.squares[i] || calculateWinner(squares.squares)) return;

    const nextSquares= squares.squares.slice();
    
    if(xIsNext) nextSquares[i]= 'X';
    else nextSquares[i]= 'O';
    
    const nextSquaresObject= {
      squares: nextSquares,
      location: i
    };
    onPlay(nextSquaresObject);
  }

  const winner= calculateWinner(squares.squares);
  let status;
  if(winner) status= "Ganador: " + winner.winner;
  else {
    !squares.squares.includes(null)? status= "Empate.": status= "Siguiente jugador: " + (xIsNext? "X": "O");
  }

  let loopedBoard= [];
  for(let row= 0; row < 3; row++) 
  {
    let boardRow= [];
    for (let col= 0; col < 3; col++)
    {
      boardRow.push(<Square key= {(row*3)+col} value= {squares.squares[(row*3)+col]} onSquareClick={() => handleClick((row*3) + col)} winnerSquare={winner && winner.cells.includes((row*3)+col)}/>)
    }
    loopedBoard.push(<div key= {row} className="board-row">{boardRow}</div>)
  }
  
  return(
    <>
      <div className="status">{status}</div>
      {loopedBoard}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), location: null}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [currentOrder, setCurrentOrder]= useState(true);
  const xIsNext= currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const locations= [
    {row: 1, col: 1},
    {row: 1, col: 2},
    {row: 1, col: 3},
    {row: 2, col: 1},
    {row: 2, col: 2},
    {row: 2, col: 3},
    {row: 3, col: 1},
    {row: 3, col: 2},
    {row: 3, col: 3},
  ]
  
  function handlePlay(nextSquares)
  {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  
  function jumpTo(nextMove)
  {
    setCurrentMove(nextMove);
  }

  function toggleOrder()
  {
    setCurrentOrder(!currentOrder);
  }

  let moves= history.map((squares, move) => {
    let description;
    if(move === currentMove)
    {
      if(move>0)
      {
        description= 'Estás en el movimiento #' + (move)+ ': ' + squares.squares[history[move].location] + ' en (' + locations[history[move].location].row + ',' + locations[history[move].location].col+ ')';
        return <li key= {move}>{description}</li>  
      }else
      {
        description= 'Inicio del juego';
        return <li key= {move}>{description}</li> 
      }
    }

    if(move>0) description= 'Ir al movimiento #' + (move) + ': ' + squares.squares[history[move].location] + ' en (' + locations[history[move].location].row + ',' + locations[history[move].location].col+ ')';
    else description= 'Ir al inicio del juego';

    return (
        <li key= {move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
    );
    
  })

  //Cambiar orden si true (ascendente) o false (descendente).
  if(!currentOrder)
  {
    moves= moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext= {xIsNext} squares= {currentSquares} onPlay= {handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className="toggle">
         <button onClick={toggleOrder}>{currentOrder? 'Cambiar historial a orden descendente':'Cambiar historial a orden ascendente'}</button>
      </div> 
    </div>
  );
}

function calculateWinner(squares)
{
  const lines= [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i= 0; i< lines.length; i++)
  {
    const [a,b,c]= lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {
        winner: squares[a],
        cells: lines[i]
      }; 
    }
  }
  return null;
}