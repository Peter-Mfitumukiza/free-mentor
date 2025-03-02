import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Mentor {
  id: string
  name: string
  expertise: string[]
  bio: string
  availability: string[]
}

interface MentorState {
  mentors: Mentor[]
  selectedMentor: Mentor | null
}

const initialState: MentorState = {
  mentors: [
    {
      id: '1',
      name: 'John Doe',
      expertise: ['Software Engineering', 'React', 'TypeScript'],
      bio: 'Experienced software engineer with 10 years of industry experience.',
      availability: ['Monday', 'Wednesday', 'Friday']
    },
    {
      id: '2',
      name: 'Jane Smith',
      expertise: ['Product Management', 'UX Design', 'Agile Methodology'],
      bio: 'Product manager with a passion for creating user-centric solutions.',
      availability: ['Tuesday', 'Thursday']
    }
  ],
  selectedMentor: null
}

const mentorSlice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    setSelectedMentor: (state, action: PayloadAction<Mentor>) => {
      state.selectedMentor = action.payload
    }
  }
})

export const { setSelectedMentor } = mentorSlice.actions
export default mentorSlice.reducer