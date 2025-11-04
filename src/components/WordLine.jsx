import React from "react"

export default function WordLine( {word, correctWord, letterFrequency, revealed} ) {

  return (
    <div className='flex flex-row space-x-1 m-1'>
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