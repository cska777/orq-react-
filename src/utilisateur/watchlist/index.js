import React, { useEffect, useState } from 'react'
import "./style.css"
import { useNavigate } from 'react-router-dom'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import PopupWatchlistDetail from './popupWatchlistDetail'
import { Rating } from '@mui/material'
import { useAppStore } from '../../store'
import { IoMdClose } from 'react-icons/io'
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Watchlist() {

  // Utilisation des méthodes et états du store
  const watchlist = useAppStore((state) => state.watchlist)
  const getWatchlist = useAppStore((state) => state.getWatchlist)
  const user = useAppStore((state) => state.user)
  const getUserData = useAppStore((state) => state.getUserData)
  const isAuth = useAppStore((state) => state.isAuth)
  const modifPropWatchlist = useAppStore((state) => state.modifPropWatchlist)
  const token = useAppStore((state) => state.token)
  const supprimerWatchlist = useAppStore((state) => state.supprimerWatchlist)

  const [itemsParPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtreTitre, setFiltreTitre] = useState("")
  const [filtreGenre, setFiltreGenre] = useState("")
  const [filtreVu, setFiltreVu] = useState("")
  const [genres, setGenres] = useState([])
  const [titres, setTitres] = useState([])
  const [selectedOeuvre, setSelectedOeuvre] = useState(null)
  const [openCardIndex, setOpenCardIndex] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      getUserData(token)

      if (isAuth) {
        getWatchlist(token)
      }
    } else {
      navigate("/")
    }
  }, [token, navigate, getUserData, getWatchlist, isAuth])

  useEffect(() => {
    if (watchlist) {
      extractGenres(watchlist)
      extractTitres(watchlist)
    }
  }, [watchlist])

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
    const genresSet = new Set();
    watchlist.forEach(oeuvre => {
      // Vérifier que `oeuvre.genres` est bien une chaîne non vide avant d'appeler `.split`
      if (typeof oeuvre.genres === "string" && oeuvre.genres.trim() !== "") {
        oeuvre.genres.split(",").forEach(genre => genresSet.add(genre.trim()));
      }
    });
    return [...genresSet];
  }

  // Extraction des titres pour proposition dynamique de la recherche
  const extractTitres = (watchlist) => {
    const titresArray = watchlist.map(oeuvre => oeuvre.titre)
    setTitres(titresArray)
  }

  // Filtrage de la watchlist en fonction des critères
  const filteredWatchlist = watchlist.filter(oeuvre =>
    oeuvre.titre.toLowerCase().includes(filtreTitre.toLowerCase()) &&
    (filtreGenre === "" || oeuvre.genres.toLowerCase().includes(filtreGenre.toLowerCase())) &&
    (filtreVu === "" || filtreVu === "vu" && oeuvre.vu || filtreVu === "À voir" && !oeuvre.vu)
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

  // Fonction pour gérer la notation par l'utilisateur
  const handleNotation = (event, oeuvre, newValue) => {
    const nvlleNote = newValue
    if (token) {
      modifPropWatchlist("note_utilisateur", nvlleNote, oeuvre.id, token)
    }
  }

  // Fonction pour supprimer une oeuvre de la watchlist
  const suppWatchlist = (event, oeuvre) => {
    event.stopPropagation()
    const answer = window.confirm(`Voulez vous vraiment supprimer "${oeuvre.titre}" de votre watchlist ?`)
    if (answer) {
      if (token) {
        supprimerWatchlist(token, oeuvre.id)
      }
    }

  }

  // Fonction pour modifier la propriété vu
  const handleVu = (event, oeuvre) => {
    const newValue = !oeuvre.vu
    event.stopPropagation()
    if (token) {
      modifPropWatchlist("vu", newValue, oeuvre.id, token)
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
        <div className='filtresVuGenreDiv'>
          <select
            value={filtreVu}
            onChange={handleFiltreChange(setFiltreVu)}
            id='filtreVu'
          >
            <option value="">Vu ?</option>
            <option value={"vu"}>Vu</option>
            <option value={"À voir"}>À voir</option>
          </select>

          <select
            value={filtreGenre}
            onChange={handleFiltreChange(setFiltreGenre)}
            id='filtreGenre'
          >

            <option value="">Tous les genres</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

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
                <div className='closePreviewDiv'>
                  <IoMdClose
                    onClick={(event) => suppWatchlist(event, oeuvre)}
                  />
                </div>
                <h2>{oeuvre.titre}</h2><br></br>
                <Rating
                  count={5}
                  onChange={(event, newValue) => handleNotation(event, oeuvre, newValue)}
                  size="medium"
                  defaultValue={oeuvre.note_utilisateur || 0}
                  className="custom-rating"
                />
                <button className='infoBtn'>Plus d'info</button>
                <div className='previewVuDiv'>
                  {oeuvre.vu ? (
                    <FaEyeSlash
                      onClick={(event) => handleVu(event, oeuvre)}
                    />
                  ) : (
                    <FaEye
                      onClick={(event) => handleVu(event, oeuvre)}
                    />
                  )}
                </div>
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
