import React, { useEffect } from 'react'
import { RiStarFill } from 'react-icons/ri'
import { IoMdClose } from "react-icons/io";


export default function PopupWatchlistDetail({ illustration, titre, press_score, genres, date_sortie, synopsis, onClose, noteUtilisateur, acteurs, realisateurs }) {

  useEffect(() => {
    document.body.classList.add("no_scroll")

    return () => {
      document.body.classList.remove("no_scroll")
    }
  })

  return (
    <div className='cardWatchlistOverlay'>
      <div className='cardWatchlist'>
        <button className='closeButton' id="closePreview" onClick={onClose}><IoMdClose /></button>
        <div className='cardWatchlistIllu'>
          <img id='watchlistIllu' src={illustration} alt={`Illustration de ${titre}`} />
        </div>
        <div className='cardWatchlistBody'>
          <div className='cardWatchlistTitre'>
            <h2>{titre}</h2>
            {press_score === 0 ? (
              <p className='text-white'>Information indisponible</p>
            ) : (
              <p className='text-white'><strong>Note de la presse : </strong><span>{press_score / 2} <RiStarFill /></span></p>
            )}
          </div>
          <div className='cardWatchlistSyno'>
            {synopsis ? (
              <p>{synopsis}</p>
            ) : (
              <p className='text-white'>Synopsis indisponible</p>
            )}
            <div className='cardWatchlistInfo'>
              <p className=''>{genres}</p>
              <p>Date de sortie : {date_sortie}</p>
            </div>
            <p className='text-white'><strong>Ma note : </strong>{noteUtilisateur === 0 || noteUtilisateur === null ? "Non évaluée" : <span>{noteUtilisateur} <RiStarFill /> </span>}</p>
          </div>
        </div>
      </div>
    </div>
  )
}