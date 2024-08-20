import React, { useEffect, useState } from 'react'

export default function PopupModifMdp({ isOpen, onClose, message}) {
  useEffect(() => {
    if(isOpen){
      const timer = setTimeout(() => {
        onClose()
      },3000)

      return () => clearTimeout(timer)
    }
  },[isOpen, onClose])

  return (
    <div>
      {isOpen && (
        <div className='popupModifMdp'>
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}
