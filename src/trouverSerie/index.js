import React, { useEffect, useState } from 'react'
import jsonData from '../asset/data/list_series_backup.json'
import './style.css'
import { useAppStore } from '../store'
import { useIsMobile } from '../hook/useIsMobile'
import { BsChevronDoubleLeft, BsChevronDoubleRight } from 'react-icons/bs'
import { RiStarFill } from 'react-icons/ri'
import { SerieDescription } from './popups'
import { FaRandom } from 'react-icons/fa'
import PopUpWatchlist from './popUpWatchlist'



export default function TrouverSerie() {
  const [series, setSeries] = useState([])
  const watchlist = useAppStore((state) => state.watchlist)
  const getWatchlist = useAppStore((state) => state.getWatchlist)
  const getUserData = useAppStore((state) => state.getUserData)

  const token = localStorage.getItem("token")

  const [historique, setHistorique] = useState([])

  const [choixGenre, setChoixGenre] = useState([])
  const [choixDateSortie, setChoixDateSortie] = useState([])
  const [choixNote, setChoixNote] = useState([])

  const [genresUnique, setGenresUnique] = useState([])
  const [noteUnique, setNoteUnique] = useState([])
  const [seriesFiltrees, setSeriesFiltrees] = useState([])

  const [divVisible, setDivVisible] = useState("divChoixFiltres")
  const [divVisibleMobile, setDivVisibleMobile] = useState("divChoixGenreSerieMobile")
  const [selectedRandomSerie, setSelectedRandomSerie] = useState(null)

  const isMobile = useIsMobile()

  const [filtres, setFiltres] = useState({
    genre: [],
    dateSortie: [],
    note: [],
  })

  useEffect(() => {
    if (token) {
      getWatchlist(token) // Récup de la watchlist
      getUserData(token) // Récup de l'user connecté
    }
  }, [token, getWatchlist, getUserData])

  useEffect(() => {

    // ------------------------- Récupération des données -----------------
    setSeries(jsonData)
  }, [filtres])

  useEffect(() => {
    // ---------------- Extraction des genres uniques -------------
    const extraireGenreUnique = () => {
      const uniqueGenres = []
      for (let serie of series) {
        if (serie.genres && Array.isArray(serie.genres)) {
          for (let genre of serie.genres) {
            if (!uniqueGenres.includes(genre)) {
              uniqueGenres.push(genre)
            }
          }
        }
      }
      setGenresUnique(uniqueGenres)
    }
    if (series.length > 0) {
      extraireGenreUnique()
    }

    // ------------------------- Extraction notes unique --------------------
    const extraireNoteUnique = () => {
      const uniqueNote = []
      for (let serie of series) {
        if (serie.note_user) {
          if (!uniqueNote.includes(serie.note_user)) {
            uniqueNote.push(serie.note_user)
          }
        }
      }
      setNoteUnique(uniqueNote)
    }

    if (series.length > 0) {
      extraireNoteUnique()
    }
  }, [series])

  // --------------------- Choix genre ------------------------
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

  // --------------------------- Choix Note ----------------------------
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
  const isSerieWatchlist = (serie) => {
    return watchlist.some((entry) => entry.titre === serie.titre)
  };

  // ------------------------ Historique ------------------------
  const isSerieHistorique = (serie) => {
    return historique.some((entry) => entry.titre === serie.titre)
  };

  // ----------------------- Filtrage ilm ------------------------
  useEffect(() => {
    const filteredSeries = series.filter((serie) => {
      return (
        (filtres.genre.length === 0 || filtres.genre.some((genre) => serie.genres.includes(genre))) &&

        (filtres.dateSortie.length === 0 || filtres.dateSortie.some((tranche) => serie.date_sortie >= tranche.debut && serie.date_sortie <= tranche.fin)) &&

        (filtres.note.length === 0 || filtres.note.includes(serie.note_user)) &&


        !isSerieWatchlist(serie) && !isSerieHistorique(serie)
      )
    })
    setSeriesFiltrees(filteredSeries)


    // Sélection du serie aléatoire parmi les series filtrés
    if (filteredSeries.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSeries.length)
      setSelectedRandomSerie(filteredSeries[randomIndex])
    } else {
      setSelectedRandomSerie(null)
    }
  }, [filtres, series, watchlist, historique])


  // ------------ Fonction de sélection aléatoire -----------------
  const selectRandomSerie = () => {
    if (seriesFiltrees.length === 0) {
      return null
    }

    const randomIndex = Math.floor(Math.random() * seriesFiltrees.length)
    const selectedRandomSerie = seriesFiltrees[randomIndex]

    setHistorique([...historique, selectedRandomSerie])
    setSelectedRandomSerie(selectedRandomSerie)

    return selectedRandomSerie
  }

  //---------------------- Navigation choix ----------------------------
  const suivant = () => {
    if (divVisible === "divChoixFiltres") {
      setDivVisible("divSeriePropose")
      selectRandomSerie()
    }
  }

  const retour = () => {
    if (divVisible === "divSeriePropose") {
      setDivVisible("divChoixFiltres")
      setHistorique([])
    }

  }

  // ------------------------- Navigation choix mobile --------------------
  const suivantMobile = () => {
    if (divVisibleMobile === "divChoixGenreSerieMobile") {
      setDivVisibleMobile("divChoixDateSerieMobile")
    } else if (divVisibleMobile === "divChoixDateSerieMobile") {
      setDivVisibleMobile("divChoixScoreSerieMobile")
    } else if (divVisibleMobile === "divChoixScoreSerieMobile") {
      setDivVisibleMobile("divSerieProposeMobile")
      selectRandomSerie()
    }
  }

  const retourMobile = () => {
    if (divVisibleMobile === "divChoixDateSerieMobile") {
      setDivVisibleMobile("divChoixGenreSerieMobile")
    } else if (divVisibleMobile === "divChoixScoreSerieMobile") {
      setDivVisibleMobile("divChoixDateSerieMobile")
    } else if (divVisibleMobile === "divSerieProposeMobile") {
      setDivVisibleMobile("divChoixScoreSerieMobile")
    }
  }

  return (
    <div className='containerFindSerie'>
      {isMobile ? (
        <div className='mobileChoixFiltres'>
          {divVisibleMobile === "divChoixGenreSerieMobile" && (
            <div id='divChoixGenreSerieMobile'>
              <div className='btnSelecSerieMobile'>
                {genresUnique.map((genre, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => choisirGenre(genre)}
                      className={`btnChoix ${choixGenre.includes(genre) ? 'selectedSerie' : 'unselected'}`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
              <div className='divBtnChoixMobile'>
                <button onClick={suivantMobile} className='btnSuivantChoix'> Suivant <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}


          {divVisibleMobile === "divChoixDateSerieMobile" && (
            <div id='divChoixDateSerieMobile'>
              <div className='btnSelecSerieMobile'>
                {[{ debut: 0, fin: 1979 }].map((tranche, index) => (
                  <button
                    key={index}
                    onClick={() => choisirTrancheDate(tranche)}
                    className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                  >
                    Sortie avant 1980
                  </button>
                ))}
                {[{ debut: 1980, fin: 1999 }].map((tranche, index) => (
                  <button
                    key={index}
                    onClick={() => choisirTrancheDate(tranche)}
                    className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                  >
                    Sortie : 1980 - 1999
                  </button>
                ))}
                {[{ debut: 2000, fin: 2009 }].map((tranche, index) => (
                  <button
                    key={index}
                    onClick={() => choisirTrancheDate(tranche)}
                    className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                  >
                    Sortie : 2000 - 2009
                  </button>
                ))}
                {[{ debut: 2010, fin: 2019 }].map((tranche, index) => (
                  <button
                    key={index}
                    onClick={() => choisirTrancheDate(tranche)}
                    className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                  >
                    Sortie : 2010 - 2019
                  </button>
                ))}
                {[{ debut: 2020, fin: Infinity }].map((tranche, index) => (
                  <button
                    key={index}
                    onClick={() => choisirTrancheDate(tranche)}
                    className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
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

          {divVisibleMobile === "divChoixScoreSerieMobile" && (
            <div id='divChoixScoreSerieMobile'>
              <div className='btnSelecSerieMobile'>
                {noteUnique.map((note, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => choisirNote(note)}
                      className={`btnChoix ${choixNote.includes(note) ? 'selectedSerie' : 'unselected'}`}
                    >
                      {note} <RiStarFill />
                    </button>
                  );
                })}
              </div>
              <div className='divBtnChoixMobile'>
                <button onClick={retourMobile} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
                <button onClick={suivantMobile} className='btnSuivantChoix'> Propose moi une série <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}

          {divVisibleMobile === "divSerieProposeMobile" && (
            <div id='divSerieProposeMobile'>
              {selectedRandomSerie ? (
                <div className='containerSeriePropose' style={{ "--bg-image": `url(${selectedRandomSerie.poster_url})` }}>
                  <div className='containerCardInfos'>
                    <div className='telephoneContainer'>
                      <div className='movie'>
                        <div className='movieMenu'>
                          <PopUpWatchlist selectedSerie={selectedRandomSerie} />
                        </div>
                        <div className='movieImg' style={{ "--bg-image-movie": `url(${selectedRandomSerie.poster_url})` }}></div>
                        <div className='cardInfoText'>
                          <div className='mr-grid'>
                            <h1>{selectedRandomSerie.titre}</h1>
                            <div className='col1 genreDuree'>
                              <p className='serieCardGenre'>
                                {selectedRandomSerie.genres.join(", ")}
                              </p>
                              {selectedRandomSerie.duree_minutes === null ? (
                                <p className='dureeCardSerie'>Durée non renseignée</p>
                              ) : (
                                <p className='dureeCardSerie'>
                                 
                                </p>
                              )}
                              <p className='noteSerieCard'>
                                {selectedRandomSerie.note_user} <span><RiStarFill /></span>
                              </p>
                            </div>
                            <div className='mr-grid'>
                              <div className='col1'>
                                <div className='SerieCardDesc'>
                                  <SerieDescription
                                    synopsis={selectedRandomSerie.synopsis}
                                    acteurs={selectedRandomSerie.acteurs}
                                    realisateur={selectedRandomSerie.realisateur}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='d-flex'>
                              <div>
                                <i></i>
                              </div>
                              <div className='dateSortieCard'>
                                Date de sortie : {selectedRandomSerie.date_sortie}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='noSerieDiv'>Aucune série trouvée avec les filtres sélectionnés.</div>
              )}
              <div className='divBtnChoix d-flex justify-content-around'>
                <button onClick={retourMobile} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
                <button onClick={selectRandomSerie} disabled={seriesFiltrees.length <= 1} className='btnSuivantChoix'> Propose moi une autre série <FaRandom /></button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {divVisible === "divChoixFiltres" && (

            <div className='divChoixFiltres'>

              <div id='divChoixGenre' className='divSelecSerie'>
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
                <div className='divBtnSelecSerie'>
                  {genresUnique.map((genre, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => choisirGenre(genre)}
                        className={`btnChoix ${choixGenre.includes(genre) ? 'selectedSerie' : 'unselected'}`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div id='divChoixDate' className='divSelecSerie'>
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
                <div className='divBtnSelecSerie'>
                  {[{ debut: 0, fin: 1979 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                    >
                      Sortie avant 1980
                    </button>
                  ))}
                  {[{ debut: 1980, fin: 1999 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                    >
                      Sortie : 1980 - 1999
                    </button>
                  ))}
                  {[{ debut: 2000, fin: 2009 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                    >
                      Sortie : 2000 - 2009
                    </button>
                  ))}
                  {[{ debut: 2010, fin: 2019 }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                    >
                      Sortie : 2010 - 2019
                    </button>
                  ))}
                  {[{ debut: 2020, fin: Infinity }].map((tranche, index) => (
                    <button
                      key={index}
                      onClick={() => choisirTrancheDate(tranche)}
                      className={`btnChoix ${isTrancheDateSelected(tranche) ? 'selectedSerie' : 'unselected'}`}
                    >
                      Sortie après 2019
                    </button>
                  ))}
                </div>
              </div>

              <div id='divChoixScore' className='divSelecSerie'>
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
                <div className='divBtnSelecSerie'>
                  {noteUnique.map((note, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => choisirNote(note)}
                        className={`btnChoix ${choixNote.includes(note) ? 'selectedSerie' : 'unselected'}`}
                      >
                        {note} <RiStarFill />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className='divBtnChoix d-flex justify-content-around'>
                <button onClick={suivant} className='btnSuivantChoix fixedBtn'> Propose moi une série <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}
        </>
      )}
      {divVisible === "divSeriePropose" && (
        <div id='divSeriePropose'>
          {selectedRandomSerie ? (
            <div className='containerSeriePropose' style={{ "--bg-image": `url(${selectedRandomSerie.poster_url})` }}>
              <div className='containerCardInfos'>
                <div className='telephoneContainer'>
                  <div className='movie'>
                    <div className='movieMenu'>
                      <PopUpWatchlist selectedSerie={selectedRandomSerie} />
                    </div>
                    <div className='movieImg' style={{ "--bg-image-movie": `url(${selectedRandomSerie.poster_url})` }}></div>
                    <div className='cardInfoText'>
                      <div className='mr-grid'>
                        <h1>{selectedRandomSerie.titre}</h1>
                        <div className='col1 genreDuree'>
                          <p className='serieCardGenre'>
                            {selectedRandomSerie.genres.join(", ")}
                          </p>
                          {selectedRandomSerie.duree_minutes === null ? (
                            <p className='dureeCardSerie'>Durée non renseignée</p>
                          ) : (
                            <p className='dureeCardSerie'>
                             
                            </p>
                          )}
                          <p className='noteSerieCard'>
                            {selectedRandomSerie.note_user} <span><RiStarFill /></span>
                          </p>
                        </div>
                        <div className='mr-grid'>
                          <div className='col1'>
                            <div className='serieCardDesc'>
                              <SerieDescription
                                synopsis={selectedRandomSerie.synopsis}
                                acteurs={selectedRandomSerie.acteurs}
                                realisateur={selectedRandomSerie.realisateur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className='d-flex'>
                          <div>
                            <i></i>
                          </div>
                          <div className='dateSortieCard'>
                            Date de sortie : {selectedRandomSerie.date_sortie}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='noSerieDiv'>Aucune série trouvée avec les filtres sélectionnés.</div>
          )}
          <div className='divBtnChoix d-flex justify-content-around'>
            <button onClick={retour} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
            <button onClick={selectRandomSerie} disabled={seriesFiltrees.length <= 1} className='btnSuivantChoix'> Propose moi une autre série <FaRandom /></button>
          </div>
        </div>
      )}
    </div>
  )
}
