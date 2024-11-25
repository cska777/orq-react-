import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store'
import { useIsMobile } from '../hook/useIsMobile'

export default function PopUpWatchlist({ selectedFilm }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [message, setMessage] = useState('')
    const isMobile = useIsMobile()

    // Récupération depuis Zustand
    const {user, token, isAuth, watchlist, ajouterWatchlist, getUserData } = useAppStore()

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if(storedToken && !isAuth){
            getUserData(storedToken)
        }
    },[getUserData,isAuth])

    const toggleModalWatchlist = async () => {
        setIsModalOpen(!isModalOpen)
        
        const token = localStorage.getItem("token")
        if (token && isAuth) {
            await getUserData(token)
        }

        if(isAuth){
            const filmExist = watchlist.some(film => film.titre === selectedFilm.titre)

        if(filmExist){
            setMessage("Ce film est déja dans votre watchlist")
        }else{
            await ajouterWatchlist(selectedFilm, user,token)
            setMessage("Film ajouté à la watchlist")
            //console.log(selectedFilm, ", Envoyé")
        }
    }else{
        setMessage("Veuillez vous connecter pour ajouter ce film à votre watchlist")
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
