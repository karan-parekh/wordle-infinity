import React from "react"
import { useEffect } from "react"

export const WHITE = 'bg-white'
export const GRAY = 'bg-gray-400'
export const YELLOW = 'bg-yellow-600'
export const GREEN = 'bg-green-600'
export const DARK_GRAY = 'bg-gray-500'

export default function WordLine( {word, correctWord, letterFrequency, revealed, updateColorMap} ) {

  return (
    <div className='flex flex-row space-x-1 m-1'>
      {word.split("").map((letter, index) => {   

        const isInCorrectWord = letter in letterFrequency
        const isInCorrectPosition = letter === correctWord[index]

        let bg_color = GRAY
        if (revealed) bg_color = DARK_GRAY
        if (isInCorrectWord && revealed) bg_color = YELLOW
        if (isInCorrectPosition && revealed) bg_color = GREEN

        return (
          <LetterBox 
            letter={letter} 
            bg_color={bg_color}
            updateColorMap={updateColorMap}
            key={index}
          />
        )
      })}
    </div>
  )
}


function LetterBox({letter, bg_color, updateColorMap}) {

  useEffect(() => {
    updateColorMap(letter, bg_color)
  }, [letter, bg_color])

  letter = letter.toUpperCase()
  return (
    <div className={`w-12 h-12 border-2 border-black text-white text-3xl font-medium ${bg_color}`}>
      {letter}
    </div>
  )
}