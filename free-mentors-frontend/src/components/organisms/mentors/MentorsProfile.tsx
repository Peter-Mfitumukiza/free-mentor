import React from 'react'
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

interface MentorProfileProps {
  mentor: Mentor & {
    email: string
    linkedin?: string
    experience: Array<{
      company: string
      role: string
      duration: string
    }>
  }
}

export const MentorProfile: React.FC<MentorProfileProps> = ({ mentor }) => {
  return (
    <Container maxWidth="md" className="py-8">
      <Paper elevation={0} className="p-8 rounded-lg border border-gray-100">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} className="flex flex-col items-center">
            <Avatar 
              src={mentor.imageUrl} 
              alt={mentor.name}
              className="w-48 h-48 mb-4"
            >
              {mentor.name.charAt(0)}
            </Avatar>
            
            <Typography variant="h5" className="mb-2">
              {mentor.name}
            </Typography>
            
            <div className="flex items-center mb-4">
              <EmailIcon fontSize="small" className="mr-2 text-primary" />
              <Typography variant="body2">{mentor.email}</Typography>
            </div>
            
            {mentor.linkedin && (
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<LinkedInIcon />}
                href={mentor.linkedin}
                target="_blank"
              >
                LinkedIn Profile
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h6" className="mb-4">
              About Me
            </Typography>
            <Typography variant="body1" className="mb-6">
              {mentor.bio}
            </Typography>
            
            <Typography variant="h6" className="mb-4">
              Areas of Expertise
            </Typography>
            <div className="flex flex-wrap gap-2 mb-6">
              {mentor.expertise.map(skill => (
                <Chip 
                  key={skill} 
                  label={skill} 
                  color="primary" 
                  variant="outlined"
                />
              ))}
            </div>
            
            <Typography variant="h6" className="mb-4 flex items-center">
              <WorkHistoryIcon className="mr-2 text-primary" />
              Professional Experience
            </Typography>
            {mentor.experience.map((exp, index) => (
              <Paper 
                key={index} 
                variant="outlined" 
                className="p-4 mb-4 rounded-lg"
              >
                <Typography variant="subtitle1" className="font-bold">
                  {exp.role}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {exp.company} | {exp.duration}
                </Typography>
              </Paper>
            ))}
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="contained" 
                color="primary"
                className="mr-4"
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