import React from 'react'
import './css/Button.css'

const Button1 = ({children}) => {
  return (
    <div>
        <button className="button text-sm px-2 py-1 rounded-sm text-white">{children}</button>
    </div>
  )
}

export default Button1