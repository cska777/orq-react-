import React, { useState } from 'react'

// ----------------------- Popup synopsis voir + ------------------
export function SerieDescription({ synopsis, realisateur, acteurs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const maxLength = 300;

    const toggleModalSerie = () => {
        setIsModalOpen(!isModalOpen);
    };
    return (
        <div>
            <p className='SerieCardDesc'>
                {synopsis.length > maxLength ? (
                    <>
                        {`${synopsis.substring(0, maxLength)}...`}
                        <button onClick={toggleModalSerie} className='voirPlusBtnDescSerie'>
                            Voir plus
                        </button>
                    </>
                ) : (
                    <>
                        {synopsis}
                        <button onClick={toggleModalSerie} className='voirPlusBtnDescSerie'>
                            En savoir plus
                        </button>
                    </>
                )}
            </p>

            {isModalOpen && (
                <div className='modalDescSerie'>
                    <div className='modalContentDescSerie'>
                        <span className='closeBtnDescSerie' onClick={toggleModalSerie}>&times;</span>
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


