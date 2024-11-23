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
                        <p>{synopsis}</p>
                        <p><span className='fw-bold'>Acteurs : </span>{acteurs.join(', ')}</p>
                        <p><span className='fw-bold'>Realisateur : </span>  {realisateur}</p>
                    </div>
                </div>
            )}
        </div>
    )
}


