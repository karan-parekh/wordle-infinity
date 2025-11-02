import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'

const WORD_LENGTH = 5
const TOTAL_GUESSES = 6

function App() {
  const [guessedWords, setGuessedWords] = useState(new Array(TOTAL_GUESSES).fill("     "))
  const [correctWord, setCorrectWord]   = useState("")
  const [letterFrequency, setLetterFrequency] = useState({})
  const [wordCount, setWordCount] = useState(0)
  const [letterCount, setLetterCount] = useState(0)
  const [currentWord, setCurrentWord] = useState("     ")
  const [gameOver, setGameOver] = useState(null)

  function printGameState() {
    console.log(`==== GAME STATE START ====`)
    console.log(`guessedWords: ${guessedWords}`)
    console.log(`correctWord: ${correctWord}`)
    console.log(`letterFrequency: ${JSON.stringify(letterFrequency)}`)
    console.log(`wordCount: ${wordCount}`)
    console.log(`letterCount: ${letterCount}`)
    console.log(`currentWord: ${currentWord}`)
    console.log(`gameOver: ${gameOver}`)
    console.log(`==== X ====`)
  }

  async function fetchNewWord() {
      localStorage.clear() // Uncomment to clear local storage and fetch new set of 1000 words
      let corpus = JSON.parse(localStorage.getItem("corpus"))
      if (corpus === null) {
        const response = await axios.get('https://api.datamuse.com/words?sp=?????&max=1000')
        localStorage.setItem('words', JSON.stringify(response.data))
        corpus = JSON.parse(localStorage.getItem("words"))
      }
      const randomIndex = Math.floor(Math.random() * corpus.length)
      const word = corpus[randomIndex].word
      setCorrectWord(word)
      const letterFrequency_ = {}
      for (let letter of word) {
        letterFrequency_[letter] = (letterFrequency_[letter] || 0) + 1
      }
      setLetterFrequency(letterFrequency_) 
    }

  // Getting the correct word
  useEffect(() => {
    fetchNewWord()
    // printGameState() // Enable for debugging or use React dev tools to check state of the game
  }, [])

  function handleEnter() {

    if (currentWord === correctWord) {
      setGameOver('WON')
      alert("YOU WON! :) Refresh the page for a new word")
      return
    }

    if (currentWord !== correctWord && wordCount === TOTAL_GUESSES - 1) {
      setGameOver('LOST')
      alert(`YOU LOST! :( The correct word was "${correctWord.toUpperCase()}" \n Refresh the page for a new word`)
      return
    }

    if (letterCount !== WORD_LENGTH) {
      console.log("Words must be 5 letters to check")
      return
    }

    setGuessedWords((current) => {
      const updatedGuessedWords = [...current]
      updatedGuessedWords[wordCount] = currentWord
      return updatedGuessedWords
    })

    setWordCount(wordCount => wordCount + 1)
    setLetterCount(0)
    setCurrentWord("     ")

  }
  
  function handleBackSpace() {
    if (letterCount === 0) {
      return
    }

    setCurrentWord((currentWord) => {
      const currentWordArray = currentWord.split("")
      currentWordArray[letterCount - 1] = " "
      const newWord = currentWordArray.join("")
      return newWord
    })

    setLetterCount(letterCount => letterCount - 1)
  }

  function handleLetters(key) {
    if (letterCount === WORD_LENGTH) {
      return
    }

    setCurrentWord((currentWord) => {
      const currentWordArray = currentWord.split("")
      currentWordArray[letterCount] = key
      const newWord = currentWordArray.join("")
      return newWord
    })

    setLetterCount(letterCount => letterCount + 1)

  }

  // This is the main useEffect that handles the game loop
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    function handleKeyDown(e) {
      if (e.key === "Enter" ) {
        handleEnter()
      } else if (e.key === "Backspace" ) {
        handleBackSpace()
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleLetters(e.key)
      } else {
        return
      }
    }

    if (gameOver) {
      document.removeEventListener('keydown', handleKeyDown)
    }
    return () => {document.removeEventListener('keydown', handleKeyDown)}
  }, [handleLetters, handleBackSpace, handleEnter, gameOver])

  function resetGame() {
    console.log(`==== RESETTING THE GAME ====`)
    setGuessedWords(new Array(TOTAL_GUESSES).fill("     "))
    fetchNewWord()
    setWordCount(0)
    setLetterCount(0)
    setCurrentWord("     ")
    setGameOver(null)
    console.log(`==== GAME RESET DONE ====`)
  }

  return (
    <>
      <span className='text-5xl text-white font-extrabold'>WORDLE!</span>
      {guessedWords.map((word, index) => {
        if (index === wordCount) {
          return (
            <WordLine 
              word={currentWord} 
              correctWord={correctWord} 
              letterFrequency={letterFrequency} 
              revealed={false || gameOver}
              key={index}
            />
          )
        }
        return (
          <WordLine 
            word={word} 
            correctWord={correctWord} 
            letterFrequency={letterFrequency} 
            revealed={true}
            key={index}
          />
        )
      })}
      <button
        onClick={(e) => {resetGame(); e.target.blur()}}
      >RESET GAME</button>
    </>
  )
}

export default App


function WordLine( {word, correctWord, letterFrequency, revealed} ) {

  return (
    <div className='flex flex-row space-x-1 m-2'>
      {word.split("").map((letter, index) => {   

        const isInCorrectWord = letter in letterFrequency
        const isInCorrectPosition = letter === correctWord[index]

        let bg_color = 'bg-white'
        if (revealed) bg_color = 'bg-gray-400'
        if (isInCorrectWord && revealed) bg_color = 'bg-yellow-500'
        if (isInCorrectPosition && revealed) bg_color = 'bg-green-400'

        return (
          <LetterBox 
            letter={letter} 
            bg_color={bg_color}
            key={index}
          />
        )
      })}
    </div>
  )
}


function LetterBox({letter, bg_color}) {
  letter = letter.toUpperCase()
  return (
    <div className={`w-12 h-12 border-2 border-black text-black text-3xl font-medium ${bg_color}`}>
      {letter}
    </div>
  )
}
