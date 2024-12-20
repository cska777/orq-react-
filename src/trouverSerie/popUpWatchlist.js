import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store'

export default function PopUpWatchlist({ selectedSerie }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [message, setMessage] = useState('')

    // Récupération depuis Zustand
    const {user, isAuth, watchlist, ajouterWatchlist, getUserData } = useAppStore()

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
            const serieExist = watchlist.some(
                serie => serie.titre.trim().toLowerCase() === selectedSerie.titre.trim().toLowerCase()
            );
            

        if(serieExist){
            setMessage("Cette série est déja dans votre watchlist")
        }else{
            await ajouterWatchlist(selectedSerie, user,token)
            setMessage("Serie ajoutée à la watchlist")
            //console.log(selectedSerie, ", Envoyé")
        }
    }else{
        setMessage("Veuillez vous connecter pour ajouter cette série à votre watchlist")
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
