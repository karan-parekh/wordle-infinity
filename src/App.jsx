import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'
import { useWordChecker } from 'react-word-checker'
import WordLine, { GREEN, YELLOW } from './components/WordLine'
import Keyboard from './components/Keyboard'

// NOTE: Make sure to refresh the corpus if the numbers are changed (original values are 5 and 6 respectively)
const WORD_LENGTH = 5 // Change length of words to guess
const MAX_ATTEMPTS = 6 // Change the number of guesses
const ALPHABET = 'qwertyuiopasdfghjklzxcvbnm'

export default function App() {
  const [guessedWords, setGuessedWords] = useState(new Array(MAX_ATTEMPTS).fill("     "))
  const [correctWord, setCorrectWord]   = useState("")
  const [letterFrequency, setLetterFrequency] = useState({})
  const [alphabetColor, setAlphabetColors] = useState(() => generateAlphabetColor())
  const [attempts, setAttempts] = useState(0)
  const [letterCount, setLetterCount] = useState(0)
  const [currentWord, setCurrentWord] = useState("     ")
  const [gameOver, setGameOver] = useState(null)
  const { _, isLoading, wordExists } = useWordChecker("en")

  function printGameState() { // For debugging purpose only
    console.log(`==== GAME STATE START ====`)
    console.log(`guessedWords: ${guessedWords}`)
    console.log(`correctWord: ${correctWord}`)
    console.log(`letterFrequency: ${JSON.stringify(letterFrequency)}`)
    console.log(`attempts: ${attempts}`)
    console.log(`letterCount: ${letterCount}`)
    console.log(`currentWord: ${currentWord}`)
    console.log(`gameOver: ${gameOver}`)
    console.log(`==== X ====`)
  }

  async function fetchNewWord() {
      // localStorage.clear() // Uncomment to clear local storage and fetch new set of 1000 words
      let corpus = JSON.parse(localStorage.getItem("corpus"))
      if (corpus === null) {
        const response = await axios.get('https://api.datamuse.com/words?sp=?????&max=1000') // '?????' = 5 character length, 'max' = maximum number of words to pull
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

  function generateAlphabetColor() {  
    const colorMap = {}
    for (let letter of ALPHABET.split("")) {
      colorMap[letter] = 'bg-white'
    }
    return colorMap
  }

  // Getting the correct word
  useEffect(() => {
    fetchNewWord()
    // printGameState() // Enable for debugging or use React dev tools to check state of the game
  }, [])

  function handleEnter() {

    if (letterCount !== WORD_LENGTH) return

    // ===== WARNING =====
    // The order of the below two functions is important, otherwise it results in the correct word being marked as an invalid English word
    // This happens because the corpus of words is pulled from https://www.datamuse.com/api/ while the validity of the word is checked by react-word-checker package
    // Ideally this should be done by the same source. 
    if (currentWord === correctWord) {
      setGameOver('WON')
      alert("YOU WON! 🎊 Reset the game for a new word")
      return
    }

    if (!isValidEnglishWord(currentWord)) {
      alert("Enter a valid English word")
      return
    }
    // ====== WARNING END ======

    if (currentWord !== correctWord && attempts === MAX_ATTEMPTS - 1) {
      setGameOver('LOST')
      alert(`YOU LOST! :( The correct word was "${correctWord.toUpperCase()}" \n Reset the game for a new word`)
      return
    }

    setGuessedWords((current) => {
      const updatedGuessedWords = [...current]
      updatedGuessedWords[attempts] = currentWord
      return updatedGuessedWords
    })

    setAttempts(attempts => attempts + 1)
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

  function isValidEnglishWord(word) {
    if (!isLoading) {
      return wordExists(word)
    }
    throw new Error("Failed to check validity of the word")
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
    setGuessedWords(new Array(MAX_ATTEMPTS).fill("     "))
    fetchNewWord()
    setAttempts(0)
    setLetterCount(0)
    setCurrentWord("     ")
    setGameOver(null)
    console.log(`==== GAME RESET DONE ====`)
  }

  function updateColorMap (letter, newColor) {
    letter = letter.toLowerCase()
    const oldColor = alphabetColor[letter]

    // Update sequence: white -> gray -> yellow -> green.
    // Color cannot be updated in reverse sequence. ex: yellow can be updated to green but not to gray
    if (oldColor === GREEN) return
    if (oldColor === YELLOW && newColor !== GREEN) return

    setAlphabetColors((colorMap) => {
      colorMap[letter] = newColor
      return colorMap
    })
  }

  return (
    <div className='flex flex-col items-center'>
      <span className='text-5xl text-white font-extrabold mb-2'>WORDLE<br/>INFINITY!</span>
      {guessedWords.map((word, index) => {
        if (index === attempts) {
          return (
            <WordLine 
              word={currentWord} 
              correctWord={correctWord} 
              letterFrequency={letterFrequency} 
              revealed={false || gameOver}
              updateColorMap={() => {}}
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
            updateColorMap={updateColorMap}
            key={index}
          />
        )
      })}
      {gameOver == null && <Keyboard colorMap={alphabetColor}/>}
      {gameOver && <button className='mt-2' onClick={(e) => {resetGame(); e.target.blur()}}>RESET GAME</button>}
    </div>
  )
}
