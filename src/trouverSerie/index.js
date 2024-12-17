import React, { useEffect, useState } from 'react'
import jsonData from '../asset/data/series_with_seasons.json'
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
    const processSeriesData = (data) => {
      return data.map((serie) => ({
        ...serie,
        vote_average: serie.vote_average / 2, // Divise la note par 2
      }));
    };
    setSeries(processSeriesData(jsonData))
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
  const trancheNoteIndex = (trancheNoteSelectionnee) => {
    for (let i = 0; i < choixNote.length; i++) {
      if (trancheEgalesNote(choixNote[i], trancheNoteSelectionnee)) {
        return i // Si la tranche est trouvée
      }
    }
    return -1 // Si la tranche n'est pas trouvée
  }

  const trancheEgalesNote = (tranche1, tranche2) => {
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  }

  const isTrancheNoteSelected = (tranche) => {
    return choixNote.some((t) => t.debut === tranche.debut && t.fin === tranche.fin)
  }

  const choisirTrancheNote = (trancheNoteSelectionnee) => {
    const index = trancheNoteIndex(trancheNoteSelectionnee)

    if (index > -1) {
      const newChoixNote = [...choixNote]
      newChoixNote.splice(index, 1)
      setChoixNote(newChoixNote)

      const newFiltres = { ...filtres }
      newFiltres.note.splice(index, 1)
      setFiltres(newFiltres)
    } else {
      const newChoixNote = [...choixNote, trancheNoteSelectionnee]
      const newFiltres = { ...filtres, note: [...filtres.note, trancheNoteSelectionnee] } // Ajout de la tranche sélectionnée

      setChoixNote(newChoixNote)
      setFiltres(newFiltres)
    }
  }

  // ------------------------- Watchlist -----------------------
  const isSerieWatchlist = React.useCallback((serie) => {
    return watchlist.some((entry) => entry.name === serie.name);
  }, [watchlist]);

  // ------------------------ Historique ------------------------
  const isSerieHistorique = React.useCallback((serie) => {
    return historique.some((entry) => entry.name === serie.name)
  }, [historique]);

  // ----------------------- Filtrage Serie ------------------------
  useEffect(() => {
    const filteredSeries = series.filter((serie) => {
      return (
        (filtres.genre.length === 0 || filtres.genre.some((genre) => serie.genres.includes(genre))) &&

        (filtres.dateSortie.length === 0 || filtres.dateSortie.some((tranche) => serie.releaseYear >= tranche.debut && serie.releaseYear <= tranche.fin)) &&

        (filtres.note.length === 0 || filtres.note.some((tranche) =>
          serie.vote_average >= tranche.debut && serie.vote_average <= tranche.fin
        )) &&

        !isSerieWatchlist(serie) && !isSerieHistorique(serie)
      )
    })
    setSeriesFiltrees(filteredSeries)

    // Sélection du serie aléatoire parmi les series filtrés
    if (filteredSeries.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSeries.length);
      setSelectedRandomSerie(filteredSeries[randomIndex]);
    } else {
      console.warn("Aucune série disponible après filtrage."); // Ajouter un log pour le cas vide
    }
  }, [filtres, series, watchlist, historique, isSerieHistorique, isSerieWatchlist])


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

  const viteUneSerie = () => {
    if (divVisibleMobile === "divChoixGenreSerieMobile") {
      setDivVisibleMobile("divSerieProposeMobile")
      selectRandomSerie()
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
                <button onClick={viteUneSerie} className='btnViteUneSerie'>Vite une série !</button>
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
                {[
                  { debut: 0, fin: 1.9, label: 1 },
                  { debut: 2, fin: 2.9, label: 2 },
                  { debut: 3, fin: 3.9, label: 3 },
                  { debut: 4, fin: 4.9, label: 4 },
                  { debut: 5, fin: 5, label: 5 }
                ].map((tranche) => (
                  <button
                    key={tranche.label}
                    onClick={() => {
                      choisirTrancheNote(tranche)
                    }}
                    className={`btnChoix ${(() => {
                      const isSelected = isTrancheNoteSelected(tranche);
                      return isSelected ? 'selectedSerie' : 'unselected';
                    })()
                      }`}
                  >
                    {tranche.label} <RiStarFill />
                  </button>
                ))}
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
                            <h1>{selectedRandomSerie.name}</h1>
                            <div className='col1 nbSaisonNote'>
                              {selectedRandomSerie.number_of_seasons === null ? (
                                <p className='dureeCardSerie'>Nombre de saison : indisponible</p>
                              ) : (
                                <p className='dureeCardSerie'>
                                  {selectedRandomSerie.number_of_seasons > 1 ? `${selectedRandomSerie.number_of_seasons} saisons` : `${selectedRandomSerie.number_of_seasons} saison`}
                                </p>
                              )}
                              <p className='noteSerieCard'>
                                {selectedRandomSerie.vote_average > 0 ? (
                                  <>{selectedRandomSerie.vote_average.toFixed(1)} < span > <RiStarFill /></span></>
                                )
                                  : (
                                    <p>Aucune évalutation</p>
                                  )}

                              </p>
                            </div>
                            <div className='mr-grid'>
                              <div className='col1'>
                                <div className='serieCardDesc'>
                                  <SerieDescription
                                    synopsis={selectedRandomSerie.overview}
                                    acteurs={selectedRandomSerie.actors}
                                    realisateur={selectedRandomSerie.directors}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='genreDiv'>
                              {selectedRandomSerie.genres.length > 0 ? (
                                <p className='serieCardGenre'>
                                  {selectedRandomSerie.genres.join(", ")}
                                </p>
                              ) : (
                                <p className='serieCardGenre'>Genres : information non disponible</p>
                              )}

                            </div>

                            <div className='d-flex'>
                              <div>
                                <i></i>
                              </div>
                              <div className='dateSortieCard'>
                                Date de sortie : {selectedRandomSerie.releaseYear}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='noSerieDiv' style={{ color: "white" }}>Aucune série trouvée avec les filtres sélectionnés.</div>
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
                              dateSortie.debut === 0 ? <>Sortie avant <strong>1980</strong></> :
                                dateSortie.debut === 1980 ? <>Date de sortie entre <strong>1980 et 1999</strong> </> :
                                  dateSortie.debut === 2000 ? <>Date de sortie entre <strong>2000 et 2009</strong></> :
                                    dateSortie.debut === 2010 ? <>Date de sortie entre <strong>2010 et 2019</strong></> :
                                      dateSortie.debut === 2020 ? <>Sortie après <strong>2019</strong></> :
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
                      {filtres.note.sort((a, b) => a.debut - b.debut).map((tranche, index) => (
                        <li key={index}>
                          {tranche.debut} - {tranche.fin} <RiStarFill />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Selectionnez un ou plusieurs filtres</p>
                  )}
                </div>
                <div className='divBtnSelecSerie'>
                  {[
                    { debut: 0, fin: 1.9, label: 1 },
                    { debut: 2, fin: 2.9, label: 2 },
                    { debut: 3, fin: 3.9, label: 3 },
                    { debut: 4, fin: 4.9, label: 4 },
                    { debut: 5, fin: 5, label: 5 }
                  ].map((tranche) => (
                    <button
                      key={tranche.label}
                      onClick={() => {
                        choisirTrancheNote(tranche)
                      }}
                      className={`btnChoix ${(() => {
                        const isSelected = isTrancheNoteSelected(tranche);
                        return isSelected ? 'selectedSerie' : 'unselected';
                      })()
                        }`}
                    >
                      {tranche.label} <RiStarFill />
                    </button>
                  ))}
                </div>
              </div>
              <div className='divBtnChoix d-flex justify-content-around'>
                <button onClick={suivant} className='btnSuivantChoix fixedBtn'> Propose moi une série <BsChevronDoubleRight /> </button>
              </div>
            </div>
          )}
        </>
      )
      }
      {
        divVisible === "divSeriePropose" && (
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
                          <h1>{selectedRandomSerie.name}</h1>
                          <div className='col1 nbSaisonNote'>
                            {selectedRandomSerie.number_of_seasons === null ? (
                              <p className='dureeCardSerie'>Nombre de saison : indisponible</p>
                            ) : (
                              <p className='dureeCardSerie'>
                                {selectedRandomSerie.number_of_seasons > 1 ? `${selectedRandomSerie.number_of_seasons} saisons` : `${selectedRandomSerie.number_of_seasons} saison`}
                              </p>
                            )}
                            <p className='noteSerieCard'>
                              {selectedRandomSerie.vote_average > 0 ? (
                                <>{selectedRandomSerie.vote_average.toFixed(1)} < span > <RiStarFill /></span></>
                              )
                                : (
                                  <p>Aucune évalutation</p>
                                )}

                            </p>
                          </div>
                          <div className='mr-grid'>
                            <div className='col1'>
                              <div className='serieCardDesc'>
                                <SerieDescription
                                  synopsis={selectedRandomSerie.overview}
                                  acteurs={selectedRandomSerie.actors}
                                  realisateur={selectedRandomSerie.directors}
                                />
                              </div>
                            </div>
                          </div>
                          <div className='genreDiv'>
                            {selectedRandomSerie.genres.length > 0 ? (
                              <p className='serieCardGenre'>
                                {selectedRandomSerie.genres.join(", ")}
                              </p>
                            ) : (
                              <p className='serieCardGenre'>Genres : information non disponible</p>
                            )}

                          </div>

                          <div className='d-flex'>
                            <div>
                              <i></i>
                            </div>
                            <div className='dateSortieCard'>
                              Date de sortie : {selectedRandomSerie.releaseYear}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='noSerieDiv' style={{ color: "white" }}>Aucune série trouvée avec les filtres sélectionnés.</div>
            )}
            <div className='divBtnChoix d-flex justify-content-around'>
              <button onClick={retour} className='btnRetourChoix'><BsChevronDoubleLeft /> Retour</button>
              <button onClick={selectRandomSerie} disabled={seriesFiltrees.length <= 1} className='btnSuivantChoix'> Propose moi une autre série <FaRandom /></button>
            </div>
          </div>
        )
      }
    </div >
  )
}
