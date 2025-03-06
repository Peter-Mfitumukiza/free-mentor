import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Updated interface to match the actual data structure from API
interface Mentor {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio?: string;
  address?: string;
  occupation?: string | null;
  expertise?: string | null;
  linkedin?: string;
}

interface MentorState {
  mentors: Mentor[];
  selectedMentor: Mentor | null;
}

const initialState: MentorState = {
  mentors: [],
  selectedMentor: null
};

const mentorSlice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    setSelectedMentor: (state, action: PayloadAction<Mentor>) => {
      state.selectedMentor = action.payload;
    },
    setMentors: (state, action: PayloadAction<Mentor[]>) => {
      state.mentors = action.payload;
    },
    clearSelectedMentor: (state) => {
      state.selectedMentor = null;
    }
  }
});

export const { setSelectedMentor, setMentors, clearSelectedMentor } = mentorSlice.actions;
export default mentorSlice.reducer;