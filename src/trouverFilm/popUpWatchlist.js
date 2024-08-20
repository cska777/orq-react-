import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function PopUpWatchlist({ selectedFilm }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [message, setMessage] = useState('')

    const toggleModalWatchlist = async () => {
        setIsModalOpen(!isModalOpen)
        
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const response = await axios.get('http://localhost:8000/user/auth/', {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (response.status === 200) {
                    setIsAuth(true)

                    const watchlistResponse = await axios.get('http://localhost:8000/watchlist/', {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    })

                    const watchlist = watchlistResponse.data
                    const filmExists = watchlist.some(film => film.titre === selectedFilm.titre)

                    if (filmExists) {
                        setMessage('Déjà ajouté à votre watchlist.')
                    } else {
                        await axios.post('http://localhost:8000/watchlist/', {
                            user_id: response.data.id,
                            titre: selectedFilm.titre,
                            illustration: selectedFilm.poster_url,
                            vu: false,
                            a_regarder_plus_tard: true,
                            type: "film",
                            duree: selectedFilm.duree_minutes,
                            date_sortie: selectedFilm.date_sortie,
                            synopsis: selectedFilm.synopsis,
                            genres: selectedFilm.genres.join(", "),
                            press_score: selectedFilm.note_user
                        }, {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        })

                        setMessage('Ajouté à la watchlist.')
                    }
                } else {
                    setIsAuth(false)
                    setMessage('Connectez-vous pour ajouter à votre Watchlist.')
                }
            } catch (error) {
                setIsAuth(false)
                setMessage('Connectez-vous pour ajouter à votre Watchlist.')
            }
        } else {
            setIsAuth(false)
            setMessage('Connectez-vous pour ajouter à votre Watchlist.')
        }

        setTimeout(() => {
            setIsModalOpen(false)
        }, 3000)
    }

    return (
        <div>
            <button onClick={toggleModalWatchlist}>Ajouter à ma watchlist</button>
            {isModalOpen && (
                <div className='popupWatchlist'>
                    <p>{message}</p>
                </div>
            )}
        </div>
    )
}
