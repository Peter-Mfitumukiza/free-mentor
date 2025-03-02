import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import mentorReducer from './slices/mentorSlice'
import sessionReducer from './slices/sessionSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    mentors: mentorReducer,
    sessions: sessionReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store