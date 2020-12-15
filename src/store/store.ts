import {combineReducers} from "redux"

import Data from "./Data"
import AppState from "./AppState"


const rootReducer = combineReducers({
  Data:Data,
  AppState:AppState,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
