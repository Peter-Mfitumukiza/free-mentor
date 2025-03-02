import React, { useState } from 'react'
import { 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  InputAdornment 
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { MentorCard } from '../../molecules/cards/MentorCard'

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    expertise: ['Software Engineering', 'React', 'Cloud Architecture'],
    bio: 'Senior Software Engineer with 8 years of experience in building scalable web applications.',
    availability: ['Monday', 'Wednesday', 'Friday'],
    imageUrl: '/path/to/sarah.jpg'
  },
  {
    id: '2',
    name: 'Michael Chen',
    expertise: ['Product Management', 'Startup Strategy', 'UX Design'],
    bio: 'Product leader who has successfully launched multiple tech products.',
    availability: ['Tuesday', 'Thursday'],
    imageUrl: '/path/to/michael.jpg'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    expertise: ['Data Science', 'Machine Learning', 'AI Ethics'],
    bio: 'PhD in Computer Science with focus on ethical AI development.',
    availability: ['Monday', 'Wednesday'],
    imageUrl: '/path/to/elena.jpg'
  }
]

export const MentorsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMentors, setFilteredMentors] = useState(mockMentors)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    
    const filtered = mockMentors.filter(mentor => 
      mentor.name.toLowerCase().includes(term) ||
      mentor.expertise.some(skill => 
        skill.toLowerCase().includes(term)
      )
    )
    
    setFilteredMentors(filtered)
  }

  const handleViewProfile = (mentorId: string) => {
    // Navigate to mentor profile or open modal
    console.log(`View profile of mentor ${mentorId}`)
  }

  const handleRequestSession = (mentorId: string) => {
    // Open session request modal or navigate to request page
    console.log(`Request session with mentor ${mentorId}`)
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography 
        variant="h4" 
        className="text-center mb-8 text-primary"
      >
        Find Your Perfect Mentor
      </Typography>
      
      <TextField 
        fullWidth
        variant="outlined"
        placeholder="Search mentors by name or expertise"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-8"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            borderRadius: '0.5rem',
          }
        }}
      />
      
      <Grid container spacing={4}>
        {filteredMentors.map(mentor => (
          <Grid item xs={12} sm={6} md={4} key={mentor.id}>
            <MentorCard 
              mentor={mentor}
              onViewProfile={handleViewProfile}
              onRequestSession={handleRequestSession}
            />
          </Grid>
        ))}
      </Grid>
      
      {filteredMentors.length === 0 && (
        <Typography 
          variant="body1" 
          className="text-center text-gray-500 mt-8"
        >
          No mentors found. Try a different search term.
        </Typography>
      )}
    </Container>
  )
}

export default MentorsList