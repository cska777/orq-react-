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
            <p className='filmCardDesc'>
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
                        <p>{synopsis}</p>
                        <p><span className='fw-bold'>Acteurs : </span>{acteurs.join(', ')}</p>
                        <p><span className='fw-bold'>Realisateur : </span>  {realisateur}</p>
                    </div>
                </div>
            )}
        </div>
    )
}


