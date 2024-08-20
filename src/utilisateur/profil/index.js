import React, { useEffect, useState } from 'react'
import "./style.css"
import axios from 'axios'
import PopupModifMdp from './popupModifMdp'
import { useNavigate } from 'react-router-dom'

export default function Profil() {
  const [oldMdp, setOldMdp] = useState("")
  const [newMdp, setNewMdp] = useState("")
  const [confirmNewMdp, setConfirmNewMdp] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const token = window.localStorage.getItem("token")
    if(!token){
      navigate("/")
    }
  })

  const gestionMdp = async (e) => {
    e.preventDefault()

    setError("")
    setMessage("")
    if (newMdp !== confirmNewMdp) {
      setError("Les mots de passes ne correspondent pas")

      return
    }

    if (newMdp === oldMdp) {
      setError("Votre nouveau mot de passe doit-être différent du mot de passe actuel")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("http://localhost:8000/change_password/", {
        old_password: oldMdp,
        new_password: newMdp
      }, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      setMessage("Mot de passe changé avec succès.")
    } catch (error) {
      if(error.message && error.response.data){
        setError(error.response.data)
      }else{
        setError("Une erreur s'est produite")
      }
    }
    setIsPopupOpen(true)
  }

  return (
    <div className='containerProfil'>
      <h1>Mon profil</h1>
      {message && <PopupModifMdp message={message} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />}
      <div className='editMdpDiv'>
        <h2>Changer mon mot de passe</h2>

        {error && <p className='errorChangeMdp'>{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
        <form onSubmit={gestionMdp} className='text-white'>
          <div>
            <label id='oldMdpLabel'>Mot de passe actuel</label><br></br>
            <input
              id='oldMdp'
              type='password'
              value={oldMdp}
              onChange={(e) => setOldMdp(e.target.value)}
              required
            >
            </input>
          </div>
          <div>
            <label id='newMdpLabel'>Nouveau mot de passe</label><br></br>
            <input
            id='newMdp'
            type='password'
            value={newMdp}
            onChange={(e) => setNewMdp(e.target.value)}
            required
            >
            </input>
          </div>
          <div>
            <label id='confirmNewMdpLabel'>Confirmer le nouveau de mot passe</label><br></br>
            <input
            id='confirmNewMdp'
            type='password'
            value={confirmNewMdp}
            onChange={(e) => setConfirmNewMdp(e.target.value)}
            >
            </input>
          </div>
          <button type="submit" id='btnChangeMdp'>Changer le mot de passe</button>
        </form>
      </div>
    </div>
  )
}
