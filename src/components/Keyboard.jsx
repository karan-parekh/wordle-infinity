import React from 'react'

const Q = 'qwertyuiop'
const A = 'asdfghjkl'
const Z = 'Enter,z,x,c,v,b,n,m,⌫'

export default function Keyboard() {

  // Base size that scales down on smaller screens
  let size = 'w-[32px] h-[40px] sm:w-[40px] sm:h-[45px] md:w-[50px] md:h-[50px]'
  let style = 'border m-[1px] sm:m-1 hover:bg-gray-400 rounded-lg flex items-center justify-center text-xs sm:text-sm md:text-base'

  function handleClick(letter) {
    const event = new KeyboardEvent('keydown', {
      key: letter === '⌫'? 'Backspace' :letter,
      code: letter === '⌫' ? 'KeyBackspace' : `Key${letter}`,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)
  }

  return (
    <div className='flex flex-col items-center gap-0.5 sm:gap-2 my-2 w-full overflow-hidden px-0.5'>
      <div className='flex justify-center w-full'>
        {Q.split("").map((charKey, _) => {
          return <button key={charKey} className={`${size} ${style}`} onClick={() => handleClick(charKey)}>
            {charKey}
          </button>
        })}
      </div>
      <div className='flex justify-center w-full'>
        {A.split("").map((charKey, _) => {
          return <button key={charKey} className={`${size} ${style}`} onClick={() => handleClick(charKey)}>
            {charKey}
          </button>
        })}
      </div>
      <div className='flex justify-center w-full'>
        {Z.split(",").map((charKey, _) => {
          let zSize = charKey === 'Enter' || charKey === '⌫' 
            ? 'w-[45px] sm:w-[60px] md:w-[70px] h-[40px] sm:h-[45px] md:h-[50px]'
            : size
          return <button key={charKey} className={`${zSize} ${style}`} onClick={() => handleClick(charKey)}>
            {charKey}
          </button>
        })}
      </div>
      
    </div>
  )
}

