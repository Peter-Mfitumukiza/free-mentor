import React from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Avatar, 
  CardActions,
  Button
} from '@mui/material'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'

interface Mentor {
  id: string
  name: string
  expertise: string[]
  bio: string
  availability: string[]
  imageUrl?: string
}

interface MentorCardProps {
  mentor: Mentor
  onViewProfile: (mentorId: string) => void
  onRequestSession: (mentorId: string) => void
}

export const MentorCard: React.FC<MentorCardProps> = ({ 
  mentor, 
  onViewProfile, 
  onRequestSession 
}) => {
  return (
    <Card 
      variant="outlined"
      className="rounded-lg hover:shadow-lg transition-shadow duration-300"
    >
      <CardContent className="flex flex-col items-center">
        <Avatar 
          src={mentor.imageUrl} 
          alt={mentor.name}
          className="w-24 h-24 mb-4"
        >
          {mentor.name.charAt(0)}
        </Avatar>
        
        <Typography variant="h6" className="text-center mb-2">
          {mentor.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="textSecondary" 
          className="text-center mb-4"
        >
          {mentor.bio}
        </Typography>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {mentor.expertise.map((skill) => (
            <Chip 
              key={skill} 
              label={skill} 
              size="small" 
              color="primary" 
              variant="outlined"
              icon={<WorkOutlineIcon fontSize="small" />}
            />
          ))}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <ScheduleIcon fontSize="small" className="mr-2" />
          <Typography variant="body2">
            Available: {mentor.availability.join(', ')}
          </Typography>
        </div>
      </CardContent>
      
      <CardActions className="flex justify-between px-4 pb-4">
        <Button 
          size="small" 
          variant="outlined"
          color="primary"
          onClick={() => onViewProfile(mentor.id)}
          className="mr-2"
        >
          View Profile
        </Button>
        <Button 
          size="small" 
          variant="contained"
          color="primary"
          onClick={() => onRequestSession(mentor.id)}
        >
          Request Session
        </Button>
      </CardActions>
    </Card>
  )
}