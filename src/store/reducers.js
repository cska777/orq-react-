import { combineReducers } from "@reduxjs/toolkit"

// État Initial 
const initialState = {
    films: [],
    series: [],
    watchlist: [],
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
}

// Reducer pour les films
function filmsReducer(state = initialState.films, action) {
    switch (action.type) {
        case "FETCH_FILMS_SUCCESS":
            return action.payload
        default:
            return state
    }
}

// Reducer pour les séries
function seriesReducer(state = initialState.series, action){
    switch (action.type){
        case "FETCH_SERIES_SUCCESS":
            return action.payload
        default:
            return state
    }
}