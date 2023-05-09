import React from 'react';
import wordList from './wordList'
import { useState, useEffect } from 'react'
import Header from './Header'
import Board from './Board'
import Keyboard from './Keyboard'
import GameOver from './GameOver'
import Alert from './Alert'


function getRandomWord() {
  return wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
}

function isInWordList(wordToCheck) {
  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i].toUpperCase() === wordToCheck) {
      return true
    }
  }

  return false
}


const defaultBoardState = [
  ['','','','',''],
  ['','','','',''],
  ['','','','',''],
  ['','','','',''],
  ['','','','',''],
  ['','','','','']
]

export default function App() {
  const [boardState, setBoardState] = useState(defaultBoardState)
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCell, setCurrentCell] = useState(0)
  const [word, setWord] = useState('')
  const [gameOver, setGameOver] = useState(0) 
  const [alerts, setAlerts] = useState([])
  const [darkModeOn, setDarkModeOn] = useState(localStorage.getItem('theme') === 'light' ? false : true);

  const addAlert = (text) => {
    setAlerts(prev => {
      let copy = [...prev]
      copy.push(text)
      return copy
    })
  }

  const removeAlert = (index) => {
    setAlerts(prev => {
      let copy = [...prev]
      copy.splice(index, 1)
      return copy;
    })
  }

  const newGame = () => {
    setWord(getRandomWord())
    setCurrentCell(0)
    setCurrentRow(0)

    setBoardState(JSON.parse(JSON.stringify(defaultBoardState)))
    setGameOver(0)
  }

  const onKeyInput = (key) => {
    if (gameOver) {
      return
    }

    if (key !== "Enter" && key !== "Back") {
      if (currentCell < 5 && currentRow < 6) {
        setBoardState(prev => {
          prev[currentRow][currentCell] = key
          return prev.map(arr => arr.slice())
        })
      }

      if (currentCell < 5) {
        setCurrentCell(prev => prev +1)
      }
    }

    if (key === "Back") {
      setBoardState(prev => {
        prev[currentRow][currentCell -1] = ''
        return prev.map(arr => arr.slice())
      })
      if (currentCell > 0) {
        setCurrentCell(prev => prev-1)
      }
    }

    if (key === "Enter") {
      let rowFull = true
      boardState[currentRow].forEach(cell => cell === '' ? rowFull = false : null)
      if (rowFull && currentRow < 6) {
        let currentWord = boardState[currentRow].join('')

     
        if (isInWordList(currentWord)) {
          setCurrentRow(prev => prev + 1)
          setCurrentCell(0)
        } else {
          addAlert('Not in word list');
        }
      }
    }
  }


  useEffect(() => {
    newGame()
  }, [])

  const onModeChange = (value) => {
    if (value) {
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.setItem('theme', 'light')
    }

    setDarkModeOn(value)
  }


  useEffect(() => {
    if (currentRow > 0 ) {
      if (currentRow === 6) {
        setGameOver(2)
      }
      if (boardState[currentRow-1].join('') === word) {
        setGameOver(1)
      }
    }
  }, [boardState, currentRow, word])

  return (<div className={"page" + (darkModeOn ? '' : ' light-mode')}><div className="container">
    {alerts.map((text,index) => <Alert text={text} key={index} onClose={() => removeAlert(index)}/>)}
    { gameOver > 0 ? <GameOver state={gameOver} addAlert={addAlert} word={word} boardState={boardState} onRestart={newGame}/> : null}
    <Header setDarkMode={onModeChange}/>
    <Board boardState={boardState} word={word} currentRow={currentRow}/>
    <Keyboard onInput={onKeyInput} boardState={boardState} word={word} currentRow={currentRow}/>
  </div></div>)
}
