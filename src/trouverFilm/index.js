import React, { useEffect, useState } from 'react'
import jsonData from '../asset/data/list_films.json'
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { FaRandom } from "react-icons/fa"
import { RiStarFill } from "react-icons/ri"
import "./style.css"
import { FilmDescription } from './popups';
import PopUpWatchlist from './popUpWatchlist';
import { useAppStore } from '../store';
import { useIsMobile } from '../hook/useIsMobile';


export default function TrouverFilm() {
  const [films, setFilms] = useState([])
  const watchlist = useAppStore((state) => state.watchlist)
  const getWatchlist = useAppStore((state) => state.getWatchlist)
  const getUserData = useAppStore((state) => state.getUserData)

  const token = localStorage.getItem("token")

  const [historique, setHistorique] = useState([])

  const [choixGenre, setChoixGenre] = useState([])
  const [choixDateSortie, setChoixDateSortie] = useState([])
  const [choixNote, setChoixNote] = useState([])
  const [choixDuree, setChoixDuree] = useState([])

  const [genresUnique, setGenresUnique] = useState([])
  const [noteUnique, setNoteUnique] = useState([])
  const [filmsFiltres, setFilmsFiltres] = useState([])

  const [divVisible, setDivVisible] = useState("divChoixFiltres")
  const [divVisibleMobile, setDivVisibleMobile] = useState("divChoixGenreFilmMobile")
  const [selectedRandomFilm, setSelectedRandomFilm] = useState(null)

  const isMobile = useIsMobile()

  const [filtres, setFiltres] = useState({
    genre: [],
    dateSortie: [],
    note: [],
    duree: []
  })

  function convertMinutesToHoursMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
  }

  useEffect(() => {
    if (token) {
      getWatchlist(token) // Récupération de la watchlist 
      getUserData(token) // Récupération de l'user connecté       
    }
  }, [token, getWatchlist, getUserData])

  useEffect(() => {
    //console.log("Filtres :", filtres)

    // ------------------- Récupération des données ----------------------
    setFilms(jsonData)
  }, [filtres])


  useEffect(() => {
    // --------------- Extraction des genres unique ---------------------
    const extraireGenreUnique = () => {
      const uniqueGenres = []
      for (let film of films) {
        if (film.genres && Array.isArray(film.genres)) {
          for (let genre of film.genres) {
            if (!uniqueGenres.includes(genre)) {
              uniqueGenres.push(genre)
            }
          }
        }
      }
      setGenresUnique(uniqueGenres)
    }
    if (films.length > 0) {
      extraireGenreUnique()
    }
    // ------------------ Extraction notes unique ----------------------
    const extraireNoteUnique = () => {
      const uniqueNote = [];
      for (let film of films) {
        if (film.note_user) {
          if (!uniqueNote.includes(film.note_user)) {
            uniqueNote.push(film.note_user);
          }
        }
      }
      setNoteUnique(uniqueNote);
    };

    if (films.length > 0) {
      extraireNoteUnique();
    }
  }, [films])

  // ----------------------- Choix genre -----------------------------
  const choisirGenre = (genreSelectionne) => {
    const index = choixGenre.indexOf(genreSelectionne)
    if (index > - 1) {
      const newChoixGenre = [...choixGenre]
      newChoixGenre.splice(index, 1)

      const newFiltres = { ...filtres }
      newFiltres.genre = [...filtres.genre]
      newFiltres.genre.splice(index, 1)

      setChoixGenre(newChoixGenre)
      setFiltres(newFiltres)
    } else {
      const newChoixGenre = [...choixGenre, genreSelectionne]
      const newFiltres = { ...filtres, genre: [...filtres.genre, genreSelectionne] }

      setChoixGenre(newChoixGenre)
      setFiltres(newFiltres)
    }
  }

  // ---------------------- Choix durée -------------------------

  const trancheDureeIndex = (trancheDureeSelectionnee) => {
    for (let i = 0; i < choixDuree.length; i++) {
      if (tranchesEgalesDuree(choixDuree[i], trancheDureeSelectionnee)) {
        return i
      }
    }
    return -1
  }

  const tranchesEgalesDuree = (tranche1, tranche2) => {
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  }

  const isTrancheDureeSelected = (tranche) => {
    return choixDuree.some((t) => t.debut === tranche.debut && t.fin === tranche.fin)
  }

  const choisirTrancheDuree = (trancheDureeSelectionnee) => {
    const index = trancheDureeIndex(trancheDureeSelectionnee)

    if (index > -1) {
      const newChoixDuree = [...choixDuree]
      newChoixDuree.splice(index, 1)
      setChoixDuree(newChoixDuree)

      const newFiltres = { ...filtres }
      newFiltres.duree.splice(index, 1)
      setFiltres(newFiltres)
    } else {
      const newChoixDuree = [...choixDuree, trancheDureeSelectionnee]
      const newFiltres = { ...filtres, duree: [...filtres.duree, trancheDureeSelectionnee] }

      setChoixDuree(newChoixDuree)
      setFiltres(newFiltres)
    }
  }

  // ------------------------- Choix date ------------------------

  const trancheDateIndex = (trancheDateSelectionnee) => {
    for (let i = 0; i < choixDateSortie.length; i++) {
      if (tranchesEgalesDate(choixDateSortie[i], trancheDateSelectionnee)) {
        return i
      }
    }
    return -1
  };

  const tranchesEgalesDate = (tranche1, tranche2) => {
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  };

  const isTrancheDateSelected = (tranche) => {
    return choixDateSortie.some(t => t.debut === tranche.debut && t.fin === tranche.fin)
  };

  const choisirTrancheDate = (trancheDateSelectionnee) => {
    const index = trancheDateIndex(trancheDateSelectionnee)

    if (index > -1) {
      const newChoixDateSortie = [...choixDateSortie]
      newChoixDateSortie.splice(index, 1)
      setChoixDateSortie(newChoixDateSortie)

      const newFiltres = { ...filtres }
      newFiltres.dateSortie.splice(index, 1)
      setFiltres(newFiltres)
    } else {
      const newChoixDateSortie = [...choixDateSortie, trancheDateSelectionnee]
      const newFiltres = { ...filtres, dateSortie: [...filtres.dateSortie, trancheDateSelectionnee] }

      setChoixDateSortie(newChoixDateSortie)
      setFiltres(newFiltres)
    }
  }

  // -------------------------- Choix note -------------------------

  const choisirNote = (noteSelectionnee) => {
    const index = choixNote.indexOf(noteSelectionnee)

    if (index > -1) {
      const newChoixNote = [...choixNote]
      newChoixNote.splice(index, 1)
      setChoixNote(newChoixNote)

      const newFiltres = { ...filtres }
      newFiltres.note.splice(index, 1)
      setFiltres(newFiltres)
    } else {
      const newChoixNote = [...choixNote, noteSelectionnee]
      setChoixNote(newChoixNote)

      const newFiltres = { ...filtres, note: [...filtres.note, noteSelectionnee] }
      setFiltres(newFiltres)

    }
  }

  // ------------------------- Watchlist -----------------------
  const isFilmWatchlist = (film) => {
    return watchlist.some((entry) => entry.titre === film.titre)
  };

  // ------------------------ Historique ------------------------
  const isFilmHistorique = (film) => {
    return historique.some((entry) => entry.titre === film.titre)
  };

  // ----------------------- Filtrage film ------------------------
  useEffect(() => {
    const filteredFilms = films.filter((film) => {
      return (
        (filtres.genre.length === 0 || filtres.genre.some((genre) => film.genres.includes(genre))) &&

        (filtres.dateSortie.length === 0 || filtres.dateSortie.some((tranche) => film.date_sortie >= tranche.debut && film.date_sortie <= tranche.fin)) &&

        (filtres.note.length === 0 || filtres.note.includes(film.note_user)) &&

        (filtres.duree.length === 0 || filtres.duree.some((tranche) => film.duree_minutes >= tranche.debut && film.duree_minutes <= tranche.fin)) &&

        !isFilmWatchlist(film) && !isFilmHistorique(film)
      )
    })
    setFilmsFiltres(filteredFilms)


    // Sélection du film aléatoire parmi les films filtrés
    if (filteredFilms.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredFilms.length)
      setSelectedRandomFilm(filteredFilms[randomIndex])
    } else {
      setSelectedRandomFilm(null)
    }
  }, [filtres, films, watchlist, historique])

  // ------------ Fonction de sélection aléatoire -----------------
  const selectRandomFilm = () => {
    if (filmsFiltres.length === 0) {
      return null
    }

    const randomIndex = Math.floor(Math.random() * filmsFiltres.length)
    const selectedRandomFilm = filmsFiltres[randomIndex]

    setHistorique([...historique, selectedRandomFilm])
    setSelectedRandomFilm(selectedRandomFilm)

    return selectedRandomFilm
  }

  //---------------------- Navigation choix ----------------------------
  const suivant = () => {
    if (divVisible === "divChoixFiltres") {
      setDivVisible("divFilmPropose")
      selectRandomFilm()
    }
  }

  const retour = () => {
    if (divVisible === "divFilmPropose") {
      setDivVisible("divChoixFiltres")
      setHistorique([])
    }

  }

  // ------------------------- Navigation choix mobile --------------------
  const suivantMobile = () => {
    if (divVisibleMobile === "divChoixGenreFilmMobile") {
      setDivVisibleMobile("divChoixDureeFilmMobile")
    } else if (divVisibleMobile === "divChoixDureeFilmMobile") {
      setDivVisibleMobile("divChoixDateFilmMobile")
    } else if (divVisibleMobile === "divChoixDateFilmMobile") {
      setDivVisibleMobile("divChoixScoreFilmMobile")
    } else if (divVisibleMobile === "divChoixScoreFilmMobile") {
      setDivVisibleMobile("divFilmProposeMobile")
      selectRandomFilm()
    }
  }

  const retourMobile = () => {
    if (divVisibleMobile === "divChoixDureeFilmMobile") {
      setDivVisibleMobile("divChoixGenreFilmMobile")
    } else if (divVisibleMobile === "divChoixDateFilmMobile") {
      setDivVisibleMobile("divChoixDureeFilmMobile")
    } else if (divVisibleMobile === "divChoixScoreFilmMobile") {
      setDivVisibleMobile("divChoixDateFilmMobile")
    } else if (divVisibleMobile === "divFilmProposeMobile") {
      setDivVisibleMobile("divChoixScoreFilmMobile")
    }
  }

  const viteUnFilm = () => {
      if(divVisibleMobile === "divChoixGenreFilmMobile"){
        setDivVisibleMobile("divFilmProposeMobile")
        selectRandomFilm()
      }
  }

  return (
    <div className='containerFindFilm'>
      {isMobile ? (
        <div className='mobileChoixFiltres'>
          {divVisibleMobile === "divChoixGenreFilmMobile" && (
            <div id='divChoixGenreFilmMobile'>
              <div className='btnSelecFilmMobile'>
              {genresUnique.map((genre, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => choisirGenre(genre)}
                        className={`btnChoix ${choixGenre.includes(genre) ? 'selectedFilm' : 'unselected'}`}
                      >
                        {genre}
                      </button>
                    );
                  })}
              </div>
              <div className='divBtnChoixMobile'>
                <button onClick={viteUnFilm} className='btnViteUnfilm'>Vite un film !</button>
                <button onClick={suivantMobile} className='btnSuivantChoix'> Suivant <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}

          {divVisibleMobile === "divChoixDureeFilmMobile" && (
            <div id='divChoixDureeFilmMobile'>
              <div className='btnSelecFilmMobile'>
              {[{ debut: 0, fin: 89 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDuree(tranche)}
                      className={`btnChoix ${isTrancheDureeSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Moins de 1h30
                    </button>
                  ))}
                  {[{ debut: 90, fin: 120 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDuree(tranche)}
                      className={`btnChoix ${isTrancheDureeSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      1h30 - 2h
                    </button>
                  ))}
                  {[{ debut: 121, fin: Infinity }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDuree(tranche)}
                      className={`btnChoix ${isTrancheDureeSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Plus de 2h
                    </button>
                  ))}
                </div>
              <div className='divBtnChoixMobile'>
                <button onClick={retourMobile} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
                <button onClick={suivantMobile} className='btnSuivantChoix'> Suivant <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}

          {divVisibleMobile === "divChoixDateFilmMobile" && (
            <div id='divChoixDateFilmMobile'>
              <div className='btnSelecFilmMobile'>
              {[{ debut: 0, fin: 1979 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie avant 1980
                    </button>
                  ))}
                  {[{ debut: 1980, fin: 1999 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie : 1980 - 1999
                    </button>
                  ))}
                  {[{ debut: 2000, fin: 2009 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie : 2000 - 2009
                    </button>
                  ))}
                  {[{ debut: 2010, fin: 2019 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie : 2010 - 2019
                    </button>
                  ))}
                  {[{ debut: 2020, fin: Infinity }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie après 2019
                    </button>
                  ))}
              </div>
              <div className='divBtnChoixMobile'>
                <button onClick={retourMobile} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
                <button onClick={suivantMobile} className='btnSuivantChoix'> Suivant <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}

          {divVisibleMobile === "divChoixScoreFilmMobile" && (
            <div id='divChoixScoreFilmMobile'>
              <div className='btnSelecFilmMobile'>
              {noteUnique.map((note, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => choisirNote(note)}
                        className={`btnChoix ${choixNote.includes(note) ? 'selectedFilm' : 'unselected'}`}
                      >
                        {note} <RiStarFill />
                      </button>
                    );
                  })}
              </div>
              <div className='divBtnChoixMobile'>
                <button onClick={retourMobile} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
                <button onClick={suivantMobile} className='btnSuivantChoix'> Propose moi un film <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}

          {divVisibleMobile === "divFilmProposeMobile" && (
            <div id='divFilmProposeMobile'>
              {selectedRandomFilm ? (
                <div className='containerFilmPropose' style={{ "--bg-image": `url(${selectedRandomFilm.poster_url})` }}>
                  <div className='containerCardInfos'>
                    <div className='telephoneContainer'>
                      <div className='movie'>
                        <div className='movieMenu'>
                          <PopUpWatchlist selectedFilm={selectedRandomFilm} />
                        </div>
                        <div className='movieImg' style={{ "--bg-image-movie": `url(${selectedRandomFilm.poster_url})` }}></div>
                        <div className='cardInfoText'>
                          <div className='mr-grid'>
                            <h1>{selectedRandomFilm.titre}</h1>
                            <div className='col1 genreDuree'>
                              <p className='filmCardGenre'>
                                {selectedRandomFilm.genres.join(", ")}
                              </p>
                              {selectedRandomFilm.duree_minutes === null ? (
                                <p className='dureeCardFilm'>Durée non renseignée</p>
                              ) : (
                                <p className='dureeCardFilm'>
                                  {convertMinutesToHoursMinutes(selectedRandomFilm.duree_minutes)}
                                </p>
                              )}
                              <p className='noteFilmCard'>
                                {selectedRandomFilm.note_user} <span><RiStarFill /></span>
                              </p>
                            </div>
                            <div className='mr-grid'>
                              <div className='col1'>
                                <div className='filmCardDesc'>
                                  <FilmDescription
                                    synopsis={selectedRandomFilm.synopsis}
                                    acteurs={selectedRandomFilm.acteurs}
                                    realisateur={selectedRandomFilm.realisateur}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='d-flex'>
                              <div>
                                <i></i>
                              </div>
                              <div className='dateSortieCard'>
                                Date de sortie : {selectedRandomFilm.date_sortie}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='noFilmDiv'>Aucun film trouvé avec les filtres sélectionnés.</div>
              )}
              <div className='divBtnChoix d-flex justify-content-around'>
                <button onClick={retourMobile} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
                <button onClick={selectRandomFilm} disabled={filmsFiltres.length <= 1} className='btnSuivantChoix'> Propose moi un autre film <FaRandom /></button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {divVisible === "divChoixFiltres" && (

            <div className='divChoixFiltres'>

              <div id='divChoixGenre' className='divSelecFilm'>
                <div className='divH2FF'>
                  <h2>Genres : </h2>
                  {filtres.genre.length > 0 ? (
                    <ul>
                      {filtres.genre.map((genre, index) => {
                        return <li key={index} >{genre}</li>
                      })}
                    </ul>
                  ) : (
                    <p>Selectionnez un ou plusieurs filtres </p>
                  )}
                </div>
                <div className='divBtnSelecFilm'>
                  {genresUnique.map((genre, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => choisirGenre(genre)}
                        className={`btnChoix ${choixGenre.includes(genre) ? 'selectedFilm' : 'unselected'}`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div id='divChoixDureeEp' className='divSelecFilm'>
                <div className='divH2FF'>
                  <h2>Duree : </h2>
                  {filtres.duree.length > 0 ? (
                    <ul>
                      {filtres.duree.map((duree, index) => {
                        return (
                          <li key={index}>
                            {duree.debut === 0 ? "Moins de 1h30" :
                              duree.debut === 90 ? "1h30 - 2H" :
                                duree.debut === 121 ? "Plus de 2h" :
                                  ""}
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p>Selectionnez un ou plusieurs filtres</p>
                  )}
                </div>
                <div className='divBtnSelecFilm'>
                  {[{ debut: 0, fin: 89 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDuree(tranche)}
                      className={`btnChoix ${isTrancheDureeSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Moins de 1h30
                    </button>
                  ))}
                  {[{ debut: 90, fin: 120 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDuree(tranche)}
                      className={`btnChoix ${isTrancheDureeSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      1h30 - 2h
                    </button>
                  ))}
                  {[{ debut: 121, fin: Infinity }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDuree(tranche)}
                      className={`btnChoix ${isTrancheDureeSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Plus de 2h
                    </button>
                  ))}
                </div>
              </div>

              <div id='divChoixDate' className='divSelecFilm'>
                <div className='divH2FF'>
                  <h2>Date de sortie : </h2>
                  {filtres.dateSortie.length > 0 ? (
                    <ul>
                      {filtres.dateSortie.map((dateSortie, index) => {
                        return (
                          <li key={index}>
                            {
                              dateSortie.debut === 0 ? "Sortie avant 1980" :
                                dateSortie.debut === 1980 ? "Date de sortie entre 1980 et 1999" :
                                  dateSortie.debut === 2000 ? "Date de sortie entre 2000 et 2009" :
                                    dateSortie.debut === 2010 ? "Date de sortie entre 2010 et 2019" :
                                      dateSortie.debut === 2020 ? "Sortie après 2019" :
                                        ""
                            }
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p>Selectionnez un ou plusieurs filtres</p>
                  )}
                </div>
                <div className='divBtnSelecFilm'>
                  {[{ debut: 0, fin: 1979 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie avant 1980
                    </button>
                  ))}
                  {[{ debut: 1980, fin: 1999 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie : 1980 - 1999
                    </button>
                  ))}
                  {[{ debut: 2000, fin: 2009 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie : 2000 - 2009
                    </button>
                  ))}
                  {[{ debut: 2010, fin: 2019 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie : 2010 - 2019
                    </button>
                  ))}
                  {[{ debut: 2020, fin: Infinity }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedFilm' : 'unselected'}`}
                    >
                      Sortie après 2019
                    </button>
                  ))}
                </div>
              </div>

              <div id='divChoixScore' className='divSelecFilm'>
                <div className='divH2FF'>
                  <h2>Note : </h2>
                  {filtres.note.length > 0 ? (
                    <ul>
                      {filtres.note.map((note, index) => {
                        return <li key={index}> {note} <RiStarFill /> </li>
                      })}
                    </ul>
                  ) : (
                    <p>Selectionnez un ou plusieurs filtres</p>
                  )}
                </div>
                <div className='divBtnSelecFilm'>
                  {noteUnique.map((note, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => choisirNote(note)}
                        className={`btnChoix ${choixNote.includes(note) ? 'selectedFilm' : 'unselected'}`}
                      >
                        {note} <RiStarFill />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className='divBtnChoix d-flex justify-content-around'>
                <button onClick={suivant} className='btnSuivantChoix fixedBtn'> Propose moi un film <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}
        </>
      )}
      {divVisible === "divFilmPropose" && (
        <div id='divFilmPropose'>
          {selectedRandomFilm ? (
            <div className='containerFilmPropose' style={{ "--bg-image": `url(${selectedRandomFilm.poster_url})` }}>
              <div className='containerCardInfos'>
                <div className='telephoneContainer'>
                  <div className='movie'>
                    <div className='movieMenu'>
                      <PopUpWatchlist selectedFilm={selectedRandomFilm} />
                    </div>
                    <div className='movieImg' style={{ "--bg-image-movie": `url(${selectedRandomFilm.poster_url})` }}></div>
                    <div className='cardInfoText'>
                      <div className='mr-grid'>
                        <h1>{selectedRandomFilm.titre}</h1>
                        <div className='col1 genreDuree'>
                          <p className='filmCardGenre'>
                            {selectedRandomFilm.genres.join(", ")}
                          </p>
                          {selectedRandomFilm.duree_minutes === null ? (
                            <p className='dureeCardFilm'>Durée non renseignée</p>
                          ) : (
                            <p className='dureeCardFilm'>
                              {convertMinutesToHoursMinutes(selectedRandomFilm.duree_minutes)}
                            </p>
                          )}
                          <p className='noteFilmCard'>
                            {selectedRandomFilm.note_user} <span><RiStarFill /></span>
                          </p>
                        </div>
                        <div className='mr-grid'>
                          <div className='col1'>
                            <div className='filmCardDesc'>
                              <FilmDescription
                                synopsis={selectedRandomFilm.synopsis}
                                acteurs={selectedRandomFilm.acteurs}
                                realisateur={selectedRandomFilm.realisateur}
                                date_sortie={selectedRandomFilm.date_sortie}
                              />
                            </div>
                          </div>
                        </div>
                        <div className='d-flex'>
                          <div>
                            <i></i>
                          </div>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='noFilmDiv' style={{ color : "white"}}>Aucun film trouvé avec les filtres sélectionnés.</div>
          )}
          <div className='divBtnChoix d-flex justify-content-around'>
            <button onClick={retour} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
            <button onClick={selectRandomFilm} disabled={filmsFiltres.length <= 1} className='btnSuivantChoix'> Propose moi un autre film <FaRandom /></button>
          </div>
        </div>
      )}
    </div>
  );

}

