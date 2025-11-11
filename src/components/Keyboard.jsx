import React from 'react'

const Q = 'q,w,e,r,t,y,u,i,o,p'
const A = 'a,s,d,f,g,h,j,k,l'
const Z = 'Enter,z,x,c,v,b,n,m,⌫'

export default function Keyboard({colorMap}) {

  return (
    <div className='flex flex-col items-center gap-0.5 sm:gap-2 my-2 w-full overflow-hidden px-0.5'>
      <KeyRow row={Q} colorMap={colorMap}/>
      <KeyRow row={A} colorMap={colorMap}/>
      <KeyRow row={Z} colorMap={colorMap}/>
    </div>
  )
}

function KeyRow({row, colorMap}) {

  function handleClick(letter) {
    const event = new KeyboardEvent('keydown', {
      key: letter === '⌫'? 'Backspace' :letter,
      code: letter === '⌫' ? 'KeyBackspace' : `Key${letter}`,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)
  }
  
  // Base size that scales down on smaller screens
  let size = 'mx-[1px] w-[10%] h-[45px] sm:w-[40px] sm:h-[45px] md:w-[50px] md:h-[50px]'
  let style = 'flex border hover:bg-gray-400 rounded-lg items-center justify-center text-xs sm:mx-1 sm:text-sm md:text-base'

  let bgColor = 'black'

  return <div className='flex justify-center w-full'>
    {row.split(",").map((letter, _) => {

      if (colorMap) bgColor = colorMap[letter]
      let zSize = letter === 'Enter' || letter === '⌫' 
        ? 'mx-[1px] w-[45px] h-[45px] px-1 sm:w-[60px] md:w-[70px] h-[40px] sm:h-[45px] md:h-[50px]'
        : size
      return <button key={letter} className={`${zSize} ${bgColor}  ${style}`} onClick={() => handleClick(letter)}>
        {letter.toUpperCase()}
      </button>
    })}
  </div>
}

