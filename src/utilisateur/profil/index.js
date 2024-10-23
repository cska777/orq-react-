import React, { useEffect, useState } from 'react'
import "./style.css"
import { useAppStore } from '../../store'


export default function Profil() {
  const token = localStorage.getItem("token")
  const [oeuvresVuCount, setOeuvresVuCount] = useState(0)
  const getUserData = useAppStore((state) => state.getUserData)
  const getWatchlist = useAppStore((state) => state.getWatchlist)
  const watchlist = useAppStore((state) => state.watchlist)

  useEffect(() => {
    if(token){
      getUserData(token)
      getWatchlist(token)
    }
  }, [token,getUserData,getWatchlist])

  useEffect(() => {
    if(watchlist){
      const count = watchlist.filter((oeuvre) => oeuvre.vu === true).length
      setOeuvresVuCount(count)
    }
  },[watchlist])

  return (
   <div className='containerProfil'>
      <div className='divProfilVus'>
        Oeuvres vue(s) :<br></br>
        {oeuvresVuCount}
      </div>
   </div>
  )
}
