import React, { useEffect, useState } from 'react'
import jsonData from '../asset/data/allocine_top_series.json'
import axios from 'axios'
import './style.css'
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { RiStarFill } from "react-icons/ri";


export default function TrouverSerie() {
  const [series, setSeries] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [historique, setHistorique] = useState([])

  const [choixGenre, setChoixGenre] = useState([])
  const [choixDateSortie, setDateSortie] = useState([])
  const [choixScore, setChoixScore] = useState([])
  const [choixDureeEp, setChoixDureeEp] = useState([])

  const [genresUnique, setGenreUnique] = useState([])
  const [seriesFiltrees, setSeriesFiltrees] = useState([])

  const [divVisible, setDivVisible] = useState("divChoixGenreSerie")
  const [selectedRandomSerie, setSelectedRandomSerie] = useState(null)

  const [filtres, setFiltres] = useState({
    genre: [],
    dateSortie: [],
    pressScore: [],
    dureeEp: []
  })

  useEffect(() => {
    setSeries(jsonData);
  }, [])



  useEffect(() => {
    const extraireGenreUnique = () => {
      const uniqueGenres = [];
      for (let serie of series) {
        if (serie.genres && Array.isArray(serie.genres)) {
          for (let genre of serie.genres) {
            if (!uniqueGenres.includes(genre)) {
              uniqueGenres.push(genre);
            }
          }
        }
      }
      setGenreUnique(uniqueGenres);
    }
    if (series.length > 0) {
      extraireGenreUnique();
    }
  }, [series])

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("https://cska777.pythonanywhere.com/watchlist/", {
        headers: {
          Authorization: `Token ${token}`
        }
      }).then(response => {
        setWatchlist(response.data);
        console.log(response.data);
      }).catch(() => {
        console.log("Erreur lors de la récupération de la watchlist");
      })
    }
  }, [])
  // ---------- Choix genre -------------
  const choisirGenre = (genreSelectionne) => {
    const index = choixGenre.indexOf(genreSelectionne);
    if (index > -1) {
      const newChoixGenre = [...choixGenre];
      newChoixGenre.splice(index, 1);

      const newFiltres = { ...filtres };
      newFiltres.genre = [...filtres.genre];
      newFiltres.genre.splice(index, 1);

      setChoixGenre(newChoixGenre);
      setFiltres(newFiltres);
    } else {
      const newChoixGenre = [...choixGenre, genreSelectionne];
      const newFiltres = { ...filtres, genre: [...filtres.genre, genreSelectionne] };

      setChoixGenre(newChoixGenre);
      setFiltres(newFiltres);
    }
  }

  // ---------- Choix durée --------------------
  const choisirTrancheDuree = (trancheDureeSelectionnee) => {
    const index = trancheDureeIndex(trancheDureeSelectionnee);

    if (index > -1) {
      const newChoixDureeEp = [...choixDureeEp];
      newChoixDureeEp.splice(index, 1);
      setChoixDureeEp(newChoixDureeEp);

      const newFiltres = { ...filtres };
      newFiltres.dureeEp.splice(index, 1);
      setFiltres(newFiltres);
    } else {
      const newChoixDureeEp = [...choixDureeEp, trancheDureeSelectionnee];
      const newFiltres = { ...filtres, dureeEp: [...filtres.dureeEp, trancheDureeSelectionnee] };

      setChoixDureeEp(newChoixDureeEp);
      setFiltres(newFiltres);
    }
  }

  const trancheDureeIndex = (trancheDureeSelectionnee) => {
    for (let i = 0; i < choixDureeEp.length; i++) {
      if (tranchesEgalesDuree(choixDureeEp[i], trancheDureeSelectionnee)) {
        return i;
      }
    }
    return -1;
  }

  const tranchesEgalesDuree = (tranche1, tranche2) => {
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin;
  };

  const isTrancheDureeSelected = (tranche) => {
    return choixDureeEp.some((t) => t.debut === tranche.debut && t.fin === tranche.fin);
  }

  // ------------------- Choix Date -------------
  const choisirTrancheDate = (trancheDateSelectionnee) => {
    const index = trancheDateIndex(trancheDateSelectionnee)

    if (index > -1) {
      const newChoixDateSortie = [...choixDateSortie]
      newChoixDateSortie.splice(index, 1)
      setDateSortie(newChoixDateSortie)

      const newFiltres = { ...filtres }
      newFiltres.dateSortie.splice(index, 1)
      setFiltres(newFiltres)
    } else {
      const newChoixDateSortie = [...choixDateSortie, trancheDateSelectionnee]
      const newFiltres = { ...filtres, dateSortie: [...filtres.dateSortie, trancheDateSelectionnee] }

      setDateSortie(newChoixDateSortie)
      setFiltres(newFiltres)
    }
  };

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

  // ------------------- Choix Score ----------------
  const choisirTrancheScore = (trancheScoreSelectionnee) => {
    const index = trancheScoreIndex(trancheScoreSelectionnee)
    if (index > -1) {
      const newChoixScore = [...choixScore]
      newChoixScore.splice(index, 1)
      setChoixScore(newChoixScore)

      const newFiltres = { ...filtres }
      newFiltres.pressScore.splice(index, 1)
      setFiltres(newFiltres)
    } else {
      const newChoixScore = [...choixScore, trancheScoreSelectionnee]
      const newFiltres = { ...filtres, pressScore: [...filtres.pressScore, trancheScoreSelectionnee] }

      setChoixScore(newChoixScore)
      setFiltres(newFiltres)
    }
  }

  const trancheScoreIndex = (trancheScoreSelectionnee) => {
    for (let i = 0; i < choixScore.length; i++) {
      if (tranchesEgalesScore(choixScore[i], trancheScoreSelectionnee)) {
        return i
      }
    }
    return -1
  }

  const tranchesEgalesScore = (tranche1, tranche2) => {
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  }

  const isTrancheScoreSelected = (tranche) => {
    return choixScore.some((t) => t.debut === tranche.debut && t.fin === tranche.fin)
  }

  // ------------------------- Watchlist -----------------------
  const isSerieWatchlist = (serie) => {
    return watchlist.some((entry) => entry.titre === serie.titre)
  };

  // ------------------------ Historique ------------------------
  const isSerieHistorique = (serie) => {
    return historique.some((entry) => entry.titre === serie.titre)
  };

  // ------------- Filtre Série ----------------
  useEffect(() => {
    const filteredSeries = series.filter((serie) => {
      return (
        (filtres.genre.length === 0 || filtres.genre.some((genre) => serie.genres.includes(genre))) &&

        (filtres.dateSortie.length === 0 || filtres.dateSortie.some((tranche) => serie.date_de_sortie >= tranche.debut && serie.date_de_sortie <= tranche.fin)) &&

        (filtres.pressScore.length === 0 || filtres.pressScore.some((tranche) => serie.press_score >= tranche.debut && serie.press_score < tranche.fin)) &&

        (filtres.dureeEp.length === 0 || filtres.dureeEp.some((tranche) => serie.duree_moyenne_episode >= tranche.debut && serie.duree_moyenne_episode <= tranche.fin)) &&

        !isSerieWatchlist(serie) && !isSerieHistorique(serie)
      )
    })

    console.log("Filtered Series: ", filteredSeries);  
    setSeriesFiltrees(filteredSeries);

    // Sélectionner une série aléatoire parmi les séries filtrées
    if (filteredSeries.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSeries.length);
      setSelectedRandomSerie(filteredSeries[randomIndex]);
    } else {
      setSelectedRandomSerie(null);
    }
  }, [filtres, series, watchlist, historique])

  //------------- Selection série aléatoire ------------------
  const selectRandomSerie = () => {
    if (seriesFiltrees.length === 0) {
      console.log("Aucune série trouvée")
      return null
    }

    const randomIndex = Math.floor(Math.random() * seriesFiltrees.length)
    const selectedRandomSerie = seriesFiltrees[randomIndex]

    setHistorique([...historique, selectedRandomSerie])
    setSelectedRandomSerie(selectedRandomSerie);

    console.log("Série sélectionnée : ",selectedRandomSerie)
    return selectedRandomSerie

  };


  //---------------------- Navigation choix ----------------------------
  const suivant = () => {
    if (divVisible === "divChoixGenreSerie") {
      setDivVisible("divChoixDureeEp")
    } else if (divVisible === "divChoixDureeEp") {
      setDivVisible("divChoixDateSerie")
    } else if (divVisible === "divChoixDateSerie") {
      setDivVisible("divChoixScoreSerie")
    } else if (divVisible === "divChoixScoreSerie") {
      setDivVisible("divSerieProposee")
      selectRandomSerie()
    }
  }

  const retour = () => {
    if (divVisible === "divChoixDureeEp") {
      setDivVisible("divChoixGenreSerie")
    } else if (divVisible === "divChoixDateSerie") {
      setDivVisible("divChoixDureeEp")
    } else if (divVisible === "divChoixScoreSerie") {
      setDivVisible("divChoixDateSerie")
    } else if (divVisible === "divSerieProposee") {
      setDivVisible("divChoixScoreSerie")
    }
  }

  return (
    <div className='containerFindSerie'>
      {divVisible === "divChoixGenreSerie" && (
        <div id='divChoixGenreSerie'>
          {genresUnique.map((genre, index) => {
            return <button
              key={index}
              onClick={() => choisirGenre(genre)}
              className={`btnChoixSerie ${choixGenre.includes(genre) ? 'selected' : 'unselected'} `}
            >{genre}
            </button>;
          })}
          <br></br>
          <div className='d-flex justify-content-center'>
            <button onClick={suivant} disabled={choixGenre.length < 1} className='btnSuivantChoixSerie'> Suivant <BsChevronDoubleRight /> </button>
          </div>
        </div>
      )}

      {divVisible === "divChoixDureeEp" && (
        <div id='divChoixDureeEp'>
          <div className='d-flex justify-content-center'>
            {[{ debut: 0, fin: 19 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDuree(tranche)}
                className={`btnChoixSerie ${isTrancheDureeSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Moins de 20 minutes
              </button>
            ))}
            {[{ debut: 20, fin: 39 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDuree(tranche)}
                className={`btnChoixSerie ${isTrancheDureeSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                20 - 39 minutes
              </button>
            ))}
            {[{ debut: 40, fin: Infinity }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDuree(tranche)}
                className={`btnChoixSerie ${isTrancheDureeSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                40 minutes et +
              </button>
            ))}
          </div>
          <div className='divBtnChoixSerie d-flex justify-content-around'>
            <button onClick={retour} className='btnRetourChoixSerie'><BsChevronDoubleLeft /> Retour  </button>
            <button onClick={suivant} disabled={choixDureeEp.length < 1} className='btnSuivantChoixSerie'> Suivant <BsChevronDoubleRight /> </button>
          </div>
        </div>
      )}

      {divVisible === "divChoixDateSerie" && (
        <div id='divChoixDateSerie'>
          <div className='d-flex justify-content-center'>
            {[{ debut: 0, fin: 1979 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDate(tranche)}
                className={`btnChoixSerie ${isTrancheDateSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Sortie avant 1980
              </button>
            ))}
            {[{ debut: 1980, fin: 1999 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDate(tranche)}
                className={`btnChoixSerie ${isTrancheDateSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Sortie : 1980 - 1999
              </button>
            ))}
            {[{ debut: 2000, fin: 2009 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDate(tranche)}
                className={`btnChoixSerie ${isTrancheDateSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Sortie : 2000 - 2009
              </button>
            ))}
            {[{ debut: 2010, fin: 2019 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDate(tranche)}
                className={`btnChoixSerie ${isTrancheDateSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Sortie : 2010 - 2019
              </button>
            ))}
            {[{ debut: 2020, fin: Infinity }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheDate(tranche)}
                className={`btnChoixSerie ${isTrancheDateSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Sortie après 2019
              </button>
            ))}
          </div>
          <div className='divBtnChoixSerie d-flex justify-content-around'>
            <button onClick={retour} className='btnRetourChoixSerie'><BsChevronDoubleLeft /> Retour  </button>
            <button onClick={suivant} disabled={choixDateSortie.length < 1} className='btnSuivantChoixSerie'> Suivant <BsChevronDoubleRight /> </button>
          </div>
        </div>
      )}

      {divVisible === "divChoixScoreSerie" && (
        <div id='divChoixScoreSerie'>
          <div className='d-flex justify-content-center'>
            {[{ debut: 1, fin: 1.9 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheScore(tranche)}
                className={`btnChoixSerie ${isTrancheScoreSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Note de la presse : <br></br>
                <RiStarFill />
              </button>
            ))}
            {[{ debut: 2, fin: 2.9 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheScore(tranche)}
                className={`btnChoixSerie ${isTrancheScoreSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Note de la presse : <br></br>
                <RiStarFill /><RiStarFill />
              </button>
            ))}
            {[{ debut: 3, fin: 3.9 }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheScore(tranche)}
                className={`btnChoixSerie ${isTrancheScoreSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Note de la presse : <br></br>
                <RiStarFill /><RiStarFill /><RiStarFill />
              </button>
            ))}
            {[{ debut: 4, fin: Infinity }].map((tranche, index) => (
              <button
                key={index}
                onClick={() => choisirTrancheScore(tranche)}
                className={`btnChoixSerie ${isTrancheScoreSelected(tranche) ? 'selected' : 'unselected'}`}
              >
                Note de la presse : <br></br>
                <RiStarFill /><RiStarFill /><RiStarFill /><RiStarFill /> <br></br>
                et +
              </button>
            ))}
          </div>
          <div className='divBtnChoixSerie d-flex justify-content-around'>
            <button onClick={retour} className='btnRetourChoixSerie'><BsChevronDoubleLeft /> Retour  </button>
            <button onClick={suivant} disabled={choixScore.length < 1} className='btnSuivantChoixSerie'> Suivant <BsChevronDoubleRight /> </button>
          </div>

        </div>
      )}

      {divVisible === "divSerieProposee" && (
        <div id='divSerieProposee'>
          {selectedRandomSerie ? (
            <div className='cardPrezSerie'style={{ '--bg-image': `url(${selectedRandomSerie.illustration_url})`}}> 
              <div className='titreSerie text-danger'>
                {selectedRandomSerie.titre}
              </div>
              <div className='realSerie'>
                Réalisation : {selectedRandomSerie.createurs}
              </div>
              <div className='acteursSerie'>
                Acteurs : {selectedRandomSerie.acteurs} 
              </div>
            </div>
          ) : (
            <div className='text-center'> Aucune série trouvée avec les filtres sélectionnés. </div>
          )

          }
          <div className='divBtnChoixSerie d-flex justify-content-around'>
            <button onClick={retour} className='btnRetourChoixSerie'><BsChevronDoubleLeft /> Retour  </button>
            <button onClick={selectRandomSerie} disabled={seriesFiltrees.length <= 1} className='btnSuivantChoixSerie'> Propose moi une autre série <FaRandom /> </button>
          </div>
        </div>
      )}
    </div>

  )

}
