import { useEffect, useRef } from 'react'
import './Board.css'
import React from 'react';


export function getKeyState(key, index, word) {
  if (key === '') return -1
  if (word.includes(key)) {
    if (word[index] === key) return 1
    else return 0
  } else return -1
}

function countLetter(letter, word) {
  let count = 0
  for(let i = 0; i < word.length; i++) {
    if (word[i] === letter) count++
  }
  return count
}

export default function Board({ boardState, word, currentRow }) {
  const boardGridEl = useRef(null)
  
  const onResize = () => {
    boardGridEl.current.style.width = (boardGridEl.current.clientHeight - 20) +'px'
  }

  useEffect(() => {
    if (boardGridEl && boardGridEl.current) {
      onResize();
      window.addEventListener('resize', onResize)
    }

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])


  const getClassName = (cell, index, row, currentRow) => {
  
    if (row >= currentRow) return "board-tile"

    
    const currentRowWord = boardState[row].join('')
    
    const letterCount = countLetter(cell, currentRowWord)

    
    if (getKeyState(cell, index, word) === 1) {
      return "board-tile tile-correct"
    }

    if (getKeyState(cell, index, word) === 0) {

      
      if (letterCount > 1) {

        
        boardState[row].forEach((letter, indx) => {
          if (getKeyState(letter, indx, word) === 1) {
            return "board-title"
          }
        })

       
        let firstIndex = 0;
        for (let i = 0; i < boardState[row].length; i++) {
          if (boardState[row][i] === cell) {
            firstIndex = i
            break
          }
        }

        if (firstIndex === index) {
          return "board-tile tile-present"
        } else {
          return "board-tile"
        }
      } else {
        return "board-tile tile-present"
      }
    }


    return "board-tile tile-wrong"

  }

  return (
    <div className='overboard'>
  <div className="board">
    <div className="board-grid" ref={boardGridEl}>
    {boardState.map((row, rowIndex) => (<div className="board-row" key={rowIndex}>
      {row.map((cell, index) => (
        <div
          className={getClassName(cell, index, rowIndex, currentRow)}
          key={index}>
          <span>
          {cell}
          </span>
        </div>
      ))}
    </div>))}
    </div>
  </div>
  </div>)
}
