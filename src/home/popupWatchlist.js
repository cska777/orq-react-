import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store'
import "./style.css"

export default function PopUpWatchlist({ selectedOeuvre }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [message, setMessage] = useState('')

    // Récupération depuis Zustand
    const { user, isAuth, watchlist, ajouterWatchlist, getUserData } = useAppStore()

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken && !isAuth) {
            getUserData(storedToken)
        }
    }, [getUserData, isAuth])

    const toggleModalWatchlist = async () => {
        setIsModalOpen(!isModalOpen)

        const token = localStorage.getItem("token")
        if (token && isAuth) {
            await getUserData(token)
        }

        if (isAuth) {
            const oeuvreExist = watchlist.some(oeuvre => oeuvre.titre === selectedOeuvre.titre)

            if (oeuvreExist) {
                setMessage("Cette oeuvre est déja dans votre watchlist")
            } else {
                await ajouterWatchlist(selectedOeuvre, user, token)
                setMessage("Oeuvre ajoutée à la watchlist")
            }
        } else {
            setMessage("Veuillez vous connecter pour ajouter cette oeuvre à votre watchlist")
        }
        setTimeout(() => {
            setIsModalOpen(false)
        }, 3000)
    }

    return (
        <>
            {isAuth ? (
                <div>
                    <button onClick={toggleModalWatchlist}>Ajouter à ma watchlist</button>
                    {isModalOpen && (
                        <div className='popupWatchlist'>
                            <p>{message}</p>
                        </div>
                    )}
                </div>
            ) : (null)}

        </>

    )
}
