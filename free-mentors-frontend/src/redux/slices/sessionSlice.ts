import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SessionRequest {
  id: string
  mentorId: string
  userId: string
  status: 'pending' | 'accepted' | 'rejected'
  requestDate: string
}

interface SessionState {
  sessions: SessionRequest[]
}

const initialState: SessionState = {
  sessions: [
    {
      id: '1',
      mentorId: '1',
      userId: 'user1',
      status: 'pending',
      requestDate: '2024-02-28'
    }
  ]
}

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    createSessionRequest: (state, action: PayloadAction<SessionRequest>) => {
      state.sessions.push(action.payload)
    },
    updateSessionStatus: (state, action: PayloadAction<{id: string, status: 'accepted' | 'rejected'}>) => {
      const session = state.sessions.find(s => s.id === action.payload.id)
      if (session) {
        session.status = action.payload.status
      }
    }
  }
})

export const { createSessionRequest, updateSessionStatus } = sessionSlice.actions
export default sessionSlice.reducer