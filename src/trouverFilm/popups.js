import React, { useState } from 'react'

// ----------------------- Popup synopsis voir + ------------------
export function FilmDescription({ synopsis, realisateur, acteurs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const maxLength = 300;

    const toggleModalFilm = () => {
        setIsModalOpen(!isModalOpen);
    };
    return (
        <div>
            <p className='FilmCardDesc'>
                {synopsis.length > maxLength ? (
                    <>
                        {`${synopsis.substring(0, maxLength)}...`}
                        <button onClick={toggleModalFilm} className='voirPlusBtnDescFilm'>
                            Voir plus
                        </button>
                    </>
                ) : (
                    <>
                        {synopsis}
                        <button onClick={toggleModalFilm} className='voirPlusBtnDescFilm'>
                            En savoir plus
                        </button>
                    </>
                )}
            </p>

            {isModalOpen && (
                <div className='modalDescFilm'>
                    <div className='modalContentDescFilm'>
                        <span className='closeBtnDescFilm' onClick={toggleModalFilm}>&times;</span>
                        <h2>Synopsis complet</h2>
                        {synopsis ? (
                            <p>{synopsis}</p>
                        ) : (
                            <p><span className='font-italic'>Synopsis non disponible</span></p>
                        )}

                        {acteurs.length > 0 ? (
                            <p><span className='fw-bold'>Acteurs : </span>{acteurs.join(', ')}</p>
                        ) : (
                            <p><span className='fw-bold'>Acteurs : </span> <span className='font-italic'>Information non disponible</span></p>
                        )}

                        {realisateur.length > 0 ? (
                            <p><span className='fw-bold'>Realisateur(s) : </span>  {realisateur.join(', ')}</p>
                        ) : (
                            <p><span className='fw-bold'>Realisateur(s) : </span> <span className='font-italic'>Information non disponible</span></p>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}


