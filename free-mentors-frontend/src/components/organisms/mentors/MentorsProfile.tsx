import React, { useEffect, useState } from 'react'
import { 
  Container, 
  Avatar, 
  Typography, 
  Grid, 
  Paper, 
  Chip,
  Button
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { RootState } from '../../../redux/store'
import { setSelectedMentor } from '../../../redux/slices/mentorSlice'
import { requestSession } from '../../../api/graphqlApi'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'

// Updated interface to match actual data structure
interface Mentor {
  id?: string
  firstName: string
  lastName: string
  email: string
  role: string
  bio?: string
  address?: string
  occupation?: string | null
  expertise?: string | null
  linkedin?: string
}

export const MentorProfile: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get mentors from Redux
  const selectedMentor = useSelector((state: RootState) => state.mentors.selectedMentor)
  const mentors = useSelector((state: RootState) => state.mentors.mentors || [])
  
  useEffect(() => {
    console.log("All of the mentors", mentors);
    console.log("Selected mentor", selectedMentor);
    
    try {
      // Since your data might not have an id field, we need to identify mentors by email
      if (!selectedMentor || (mentorId && selectedMentor.email !== mentorId)) {
        // Try to find mentor by the email since that seems to be unique
        const mentor = mentors.find(m => m.email === mentorId)
        if (mentor) {
          dispatch(setSelectedMentor(mentor))
        } else {
          setError("Mentor not found")
          setTimeout(() => {
            navigate('/dashboard')
          }, 3000)
        }
      }
      setLoading(false)
    } catch (err) {
      console.error("Error in MentorProfile component:", err)
      setError("An error occurred while loading mentor data")
      setLoading(false)
    }
  }, [mentorId, selectedMentor, mentors, dispatch, navigate])
  
  const handleRequestSession = async () => {
    if (!selectedMentor || !token) return
    
    try {
      const result = await requestSession(selectedMentor.email, token)
      
      if (result.success) {
        toast.success("Session request sent successfully")
      } else {
        toast.error(result.message || "Failed to request session")
      }
    } catch (error) {
      console.error("Request session error:", error)
      toast.error("An error occurred during session request")
    }
  }
  
  if (loading) {
    return (
      <Container maxWidth="md" className="py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </Container>
    )
  }
  
  if (error || !selectedMentor) {
    return (
      <Container maxWidth="md" className="py-8">
        <Paper elevation={0} className="p-8 rounded-lg border border-red-100">
          <Typography variant="h5" className="text-red-600 mb-4">
            {error || "Mentor data not available"}
          </Typography>
          <Typography variant="body1" className="mb-6">
            Redirecting to dashboard...
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard Now
          </Button>
        </Paper>
      </Container>
    )
  }

  // Create full name from firstName and lastName
  const mentorName = `${selectedMentor.firstName} ${selectedMentor.lastName}`;
      
  // Get initial for Avatar
  const avatarInitial = mentorName && mentorName.length > 0 ? mentorName.charAt(0) : "M";

  return (
    <Container maxWidth="md" className="py-8">
      <Button 
        onClick={() => navigate('/dashboard')}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        &larr; Back to Dashboard
      </Button>
      
      <Paper elevation={0} className="p-8 rounded-lg border border-gray-100">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} className="flex flex-col items-center">
            <Avatar 
              alt={mentorName}
              className="w-48 h-48 mb-4"
            >
              {avatarInitial}
            </Avatar>
            
            <Typography variant="h5" className="mb-2">
              {mentorName}
            </Typography>
            
            <div className="flex items-center mb-4">
              <EmailIcon fontSize="small" className="mr-2 text-primary" />
              <Typography variant="body2">{selectedMentor.email}</Typography>
            </div>
            
            {selectedMentor.linkedin && (
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<LinkedInIcon />}
                href={selectedMentor.linkedin}
                target="_blank"
              >
                LinkedIn Profile
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* Bio Section */}
            <Typography variant="h6" className="mb-4">
              About Me
            </Typography>
            <Typography variant="body1" className="mb-6">
              {selectedMentor.bio || "No bio information available."}
            </Typography>
            
            {/* Expertise Section - Changed to handle single string expertise */}
            {selectedMentor.expertise && (
              <>
                <Typography variant="h6" className="mb-4">
                  Areas of Expertise
                </Typography>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Chip 
                    label={selectedMentor.expertise} 
                    color="primary" 
                    variant="outlined"
                  />
                </div>
              </>
            )}
            
            {/* Occupation Section */}
            {selectedMentor.occupation && (
              <>
                <Typography variant="h6" className="mb-4 flex items-center">
                  <WorkHistoryIcon className="mr-2 text-primary" />
                  Professional Occupation
                </Typography>
                <Paper 
                  variant="outlined" 
                  className="p-4 mb-4 rounded-lg"
                >
                  <Typography variant="subtitle1" className="font-bold">
                    {selectedMentor.occupation}
                  </Typography>
                </Paper>
              </>
            )}
            
            {/* Address Section */}
            {selectedMentor.address && (
              <>
                <Typography variant="h6" className="mb-4">
                  Location
                </Typography>
                <Typography variant="body1" className="mb-6">
                  {selectedMentor.address}
                </Typography>
              </>
            )}
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="contained" 
                color="primary"
                className="mr-4"
                onClick={handleRequestSession}
              >
                Request Mentorship
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
              >
                Schedule Call
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default MentorProfile