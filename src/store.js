import axios from "axios";
import { create } from "zustand";

const API_URL =
process.env.NODE_ENV === "development"
? process.env.REACT_APP_BACKEND_URL_DEV
: process.env.REACT_APP_BACKEND_URL_PROD

export const useAppStore = create((set) => ({
    
    // Gestion de l'user
    user: null,
    token: null,
    isAuth: false,
    watchlist: [], // État initial de la watchlist

    // Récupération de la watchlist
    getWatchlist: async (token) => {
        if (token) {
            try {
                const response = await axios.get(`${API_URL}/watchlist/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })

                // Mise à jour de la watchlist dans Zustand avec les données récupérées
                set({ watchlist: response.data });
                console.log("Watchlist récupérée : ", response.data)
            } catch (error) {
                console.error("Erreur lors de la récupération de la watchlist")
            }
        }
    },

    // Mise à jour de la watchlist locale
    updateWatchlist: (newItem) => set((state) => ({
        watchlist: [...state.watchlist, newItem]
    })),

    // Ajouter un film à la watchlist
    ajouterWatchlist: async (selectedRandomFilm, userData, token) => {

        const data = {
            user_id: userData.id,
            titre: selectedRandomFilm.titre,
            illustration: selectedRandomFilm.poster_url,
            vu: false,
            a_regarder_plus_tard: true,
            type: "film",
            duree: selectedRandomFilm.duree_minutes,
            date_sortie: selectedRandomFilm.date_sortie,
            synopsis: selectedRandomFilm.synopsis,
            genres: selectedRandomFilm.genres.join(", "),
            press_score: selectedRandomFilm.note_user
        }

        if (token) {
            try {
                const response = await axios.post(`${API_URL}/watchlist/`, data, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })

                if (response.status === 201) {
                    // MAJ de la watchlist dans Zuustand après succès
                    set((state) => ({
                        watchlist: [...state.watchlist, response.data]
                    }))
                    console.log("Film ajouté à la watchlist avec succès")
                }

            } catch (error) {
                console.error("Erreur lors de l'ajout à la watchlist")
            }
        }

    },

    // Supprimer un film de la watchlist
    supprimerWatchlist: async (token, itemId) => {
        if (token) {
            try {
                const response = await axios.delete(`${API_URL}/watchlist/${itemId}/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })

                if (response.status === 204) {
                    // Si la suppression est réussie (statut 204), mettre à jour la watchlist dans Zustand
                    set((state) => ({
                        watchlist: state.watchlist.filter(item => item.id !== itemId)
                    }));
                    console.log("Oeuvre supprimée de la watchlist avec succès");
                } else {
                    console.error(`Erreur inattendue lors de la suppression, code de statut : ${response.status}`);
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de l'oeuvre de la watchlist", error.response ? error.response.data : error.message);
            }
        } else {
            console.error("Token non fourni, impossible de supprimer de la watchlist");
        }
    },

    // Modifier propriété de la watchlist 
    modifPropWatchlist: async (propriete, nvlleValeur, itemId, token) => {
        if (token) {
            try {
                const data = { [propriete]: nvlleValeur }
                console.log("Data Watchlist modif",data)

                const response = await axios.patch(`${API_URL}/watchlist/${itemId}/`, data, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })
                console.log("Response Watchlist modif",response)
                if (response.status === 200) {
                    set((state) => ({
                        watchlist: state.watchlist.map(item =>
                            item.id === itemId ? { ...item, [propriete]: nvlleValeur } : item
                        )
                    }))
                    console.log("Propriété mise à jour avec succès")
                } else {
                    console.error(`Erreur inatendue lors de la mise à jour de la watchlist, code de statut : ${response.status}`)
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la propriété de l'oeuvre dans la watchlist", error.response ? error.response.data : error.message);
            }
        } else {
            console.error("Token non fourni, impossible de mettre à jour la watchlist");
        }
    },



    // Récupération de l'user connecté
    getUserData: async (token) => {
        if (token) {
            try {
                const response = await axios.get(`${API_URL}/user/auth/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                })
                // Mise à jour de l'état de l'user
                set((state) => {
                    if (state.user !== response.data) {  
                        return {
                            isAuth: true,
                            user: response.data,
                            token: token,
                        };
                    }
                    return state;
                });
                console.log("User connecté : ", response.data)
            } catch (error) {
                console.error("Erreur lors de la récupéaration de l'user")
                set({
                    isAuth: false,
                    user: null,
                    token: null
                })
            }
        }
    },

    // Déconnexion de l'user
    logout: () => {
        set({
            isAuth: false,
            user: null,
            token: null,
            watchlist: []
        })
        localStorage.removeItem("token")
    }

}))