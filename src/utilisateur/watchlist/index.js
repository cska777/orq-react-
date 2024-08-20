import React, { useEffect, useState } from 'react'
import "./style.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { RiStarFill } from "react-icons/ri"
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import PopupWatchlistDetail from './popupWatchlistDetail'
import { Rating } from '@mui/material'

export default function Watchlist() {
  const [isAuth, setIsAuth] = useState()
  const [watchlist, setWatchlist] = useState([])
  const [userData, setUserData] = useState(null)
  const [itemsParPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtreTitre, setFiltreTitre] = useState("")
  const [filtreGenre, setFiltreGenre] = useState("")
  const [genres, setGenres] = useState([])
  const [titres, setTitres] = useState([])
  const [selectedOeuvre, setSelectedOeuvre] = useState(null)
  const [openCardIndex, setOpenCardIndex] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.get("http://localhost:8000/user/auth/", {
        headers: {
          Authorization: `Token ${token}`
        }
      }).then(response => {
        setIsAuth(true)
        setUserData(response.data)
        console.log(response.data)
      }).catch(() => {
        setIsAuth(false)
        navigate("/")
      })
    } else {
      setIsAuth(false)
      navigate("/")
    }

    if (token) {
      axios.get("http://localhost:8000/watchlist/", {
        headers: {
          Authorization: `Token ${token}`
        }
      }).then(response => {
        setWatchlist(response.data)
        console.log("Watchlist: ", response.data)
        extractGenres(response.data)
        extractTitres(response.data)
      }).catch(() => {
        console.log("Erreur lors de la récupération de la watchlist")
      })
    }
  }, [navigate])


  // Change de page
  const handleChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleFiltreChange = (setter) => (event) => {
    setter(event.target.value)
    setCurrentPage(1)
  }
  

  // Extraction genres unique pour filtre
  const extractGenres = (watchlist) => {
    const genresSet = new Set()
    watchlist.forEach(oeuvre => {
      oeuvre.genres.split(",").forEach(genre => genresSet.add(genre.trim()))
    })
    setGenres([...genresSet])
    console.log("Genres :", genres)
  }

  // Extraction des titres pour proposition dynamique de la recherche
  const extractTitres = (watchlist) => {
    const titresArray = watchlist.map(oeuvre => oeuvre.titre)
    setTitres(titresArray)
  }

  // Filtrage de la watchlist en fonction des critères
  const filteredWatchlist = watchlist.filter(oeuvre =>
    oeuvre.titre.toLowerCase().includes(filtreTitre.toLowerCase()) &&
    (filtreGenre === "" || oeuvre.genres.toLowerCase().includes(filtreGenre.toLowerCase()))
  );

  // Calcul des éléments à afficher sur la page actuelle
  const indexDernierItem = currentPage * itemsParPage
  const indexPremierItem = indexDernierItem - itemsParPage
  const currentItems = filteredWatchlist.slice(indexPremierItem, indexDernierItem)

  // Gestion de l'ouverture du popup avec les détails
  const handleCardClick = (index, oeuvre) => {
    setOpenCardIndex(openCardIndex === index ? null : index)
    setSelectedOeuvre(oeuvre)
  }

  const handleNotation = (event, oeuvre) => {
    const nvlleNote = parseInt(event.target.value)
    const token = localStorage.getItem("token")
    if(token){
      axios.post(`http://localhost:8000/${oeuvre.id}/note_entree_watchlist/`, {note_utilisateur:nvlleNote},{
        headers:{
          Authorization : `Token ${token}`
        }
      }).then(response => {
        console.log("Reponse api : " , response.data)
        setWatchlist(prevWatchlist =>
          prevWatchlist.map(item => 
            item.id === oeuvre.id ? {...item,note_utilisateur:nvlleNote} : item
            )
          )
      }).catch(error => {
        console.log("Erreur lors de l'enregistrement de la note")
      })
    }
  }

  return (
    <div className='containerWatchlist'>
      <h1>Ma Watchlist</h1>

      <div className='filterContainer'>
        <input
          type='text'
          placeholder='Rechercher par titre'
          value={filtreTitre}
          onChange={handleFiltreChange(setFiltreTitre)}
        />

        <select
          value={filtreGenre}
          onChange={handleFiltreChange(setFiltreGenre)}
          
        >
          <option value="">Tous les genres</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      {filteredWatchlist.length === 0 ? (
        <h2 className="text-center" style={{ color: "var(--hover-btn)" }}>Votre watchlist est vide pour l'instant</h2>
      ) : (
        <div className='previewCardContainer'>
          {currentItems.map((oeuvre, index) => (
            <div key={index} className='cardPreviewWatchlist' onClick={() => handleCardClick(index, oeuvre)}>
              <div className='cardPreviewIllu'>
                <img id='watchlistIlluPreview' src={oeuvre.illustration} alt={`Illustration de ${oeuvre.titre}`} />
              </div>
              <div className="cardPreviewOverlay">
                <h2>{oeuvre.titre}</h2><br></br>
                <Rating 
                count={5}
                onChange={(nvlleNote) => handleNotation(nvlleNote, oeuvre)}
                size="medium"
                defaultValue={oeuvre.note_utilisateur || 1}
                className="custom-rating"
                />
                <button className='infoBtn'>Plus d'info</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedOeuvre && openCardIndex !== null && (
        <PopupWatchlistDetail
          illustration={selectedOeuvre.illustration}
          titre={selectedOeuvre.titre}
          press_score={selectedOeuvre.press_score}
          genres={selectedOeuvre.genres}
          date_sortie={selectedOeuvre.date_sortie}
          synopsis={selectedOeuvre.synopsis}
          onClose={() => setOpenCardIndex(null)}
          noteUtilisateur={selectedOeuvre.note_utilisateur}
        />
      )}
      <Stack spacing={2} className='pagination-container'>
        <Pagination
          count={Math.ceil(filteredWatchlist.length / itemsParPage)}
          page={currentPage}
          onChange={handleChange}
          variant="outlined"
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "var(--bg-grad1)",
              backgroundColor: "var(--font-color)",
              "&.Mui-selected": {
                backgroundColor: "var(--bg-grad1)",
                color: "white",
                border: "1px solid white"
              },
              "&:hover": {
                backgroundColor: "var(--bg-grad2)",
                color: "white"
              }
            }
          }}
        />
      </Stack>
    </div>
  )
}
