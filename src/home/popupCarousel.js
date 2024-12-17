import React from "react";
import PopUpWatchlist from "./popupWatchlist";

export function OeuvreDescription({ selectedOeuvre, titre, synopsis, realisateur, acteurs, date_sortie, onClose }) {

    return (
        <div>
            <div className="modalDesc">
                <div className="modalContentDesc">
                    <span className="closeBtnDesc" onClick={onClose}>&times;</span>
                    <h1 className="text-center">{titre}</h1>
                    <h2>Synopsis : </h2>
                    {synopsis ? (
                            <p>{synopsis}</p>
                        ) : (
                            <p><span className='font-italic'>Synopsis non disponible</span></p>
                        )}

                        {acteurs.length > 0 ? (
                            <p><span className='fw-bold'>Acteurs : </span>{acteurs.slice(0, 5).join(', ')}</p>
                        ) : (
                            <p><span className='fw-bold'>Acteurs : </span> <span className='font-italic'>Information non disponible</span></p>
                        )}

                        {realisateur.length > 0 ? (
                            <p><span className='fw-bold'>Realisateur(s) : </span>  {realisateur.join(', ')}</p>
                        ) : (
                            <p><span className='fw-bold'>Realisateur(s) : </span> <span className='font-italic'>Information non disponible</span></p>
                        )}

                        {date_sortie ? (
                            <p><span className='fw-bold'>Date de sortie : </span>{date_sortie}</p>
                        ) : (
                            <p><span className='fw-bold'>Date de sortie : </span><span className='font-italic'>Information non disponible</span></p>
                        )}
                    <div className="divWatchlist">
                        <PopUpWatchlist
                            selectedOeuvre={selectedOeuvre}
                        />
                    </div>

                </div>

            </div>
        </div>
    )
}