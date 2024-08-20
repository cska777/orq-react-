import { Rating } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { RiStarFill } from 'react-icons/ri'

export default function PopupWatchlistDetail({ illustration, titre, press_score, genres, date_sortie, synopsis, onClose ,noteUtilisateur}) {

  useEffect(() => {
    document.body.classList.add("no_scroll")
    
    return() => {
      document.body.classList.remove("no_scroll")
    }
  })

    return (
      <div className='cardWatchlistOverlay'>
        <div className='cardWatchlist'>
          <button className='closeButton' onClick={onClose}>X</button>
          <div className='cardWatchlistIllu'>
            <img id='watchlistIllu' src={illustration} alt={`Illustration de ${titre}`} />
          </div>
          <div className='cardWatchlistBody'>
            <div className='cardWatchlistTitre'>
              <h2>{titre}</h2>
              <p className='text-white'><strong>Note de la presse : </strong><span>{press_score} <RiStarFill /></span></p>
            </div>
            <div className='cardWatchlistInfo'>
              <p>{genres}</p>
              <p>Date de sortie : {date_sortie}</p>
            </div>
            <div className='cardWatchlistSyno'>
              <p>{synopsis}</p>
              <p className='text-white'><strong>Ma note : </strong>{noteUtilisateur === 0 || noteUtilisateur === null ? "Non évaluée" : <span>{noteUtilisateur} <RiStarFill /> </span>}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }