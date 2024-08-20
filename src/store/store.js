import {applyMiddleware, configStore} from "@reduxjs/toolkit"
import thunk from "redux-thunk"

export const store = configStore(rootReducer, applyMiddleware(thunk))

export default store