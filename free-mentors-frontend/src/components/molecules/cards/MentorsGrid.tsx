import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  InputAdornment,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from '@mui/icons-material';
import MentorCard from './MentorCard';

interface MentorsGridProps {
  mentors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    expertise?: string;
  }>;
  isLoading: boolean;
  error: string | null;
  handleRequestSession: (email: string) => Promise<boolean>;
}

const MentorsContainer = styled(Paper)({
  borderRadius: '10px',
  boxShadow: 'none',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
});

const MentorsHeader = styled(Box)({
  padding: '20px 32px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '16px',
});

const MentorsContent = styled(Box)({
  padding: '24px',
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d0d0d0',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1A5FFF',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
  }
});

const StyledFormControl = styled(FormControl)({
  minWidth: '200px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d0d0d0',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1A5FFF',
    },
  },
});

const NoMentorsMessage = styled(Box)({
  textAlign: 'center',
  padding: '40px 0',
  color: '#666',
});

const MentorsGrid: React.FC<MentorsGridProps> = ({ 
  mentors, 
  isLoading, 
  error, 
  handleRequestSession 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [requestingMentor, setRequestingMentor] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const expertiseAreas = useMemo(() => {
    const areas = new Set(mentors
      .map(mentor => mentor.expertise || 'General Mentoring')
      .filter(Boolean));
    return ['All Expertise Areas', ...Array.from(areas)];
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        fullName.includes(searchQuery.toLowerCase()) ||
        (mentor.bio && mentor.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mentor.expertise && mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesExpertise = expertiseFilter === '' || expertiseFilter === 'All Expertise Areas' || 
        mentor.expertise === expertiseFilter || 
        (!mentor.expertise && expertiseFilter === 'General Mentoring');
        
      return matchesSearch && matchesExpertise;
    });
  }, [mentors, searchQuery, expertiseFilter]);

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const paginatedMentors = filteredMentors.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  useEffect(() => {
    setPage(1);
  }, [searchQuery, expertiseFilter]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: document.getElementById('mentors-grid')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleExpertiseChange = (event: SelectChangeEvent) => {
    setExpertiseFilter(event.target.value);
  };

  const handleRequest = async (email: string) => {
    setRequestingMentor(email);
    try {
      const success = await handleRequestSession(email);
      return success;
    } catch (error) {
      console.error("Error in handleRequest:", error);
      return false;
    } finally {
      setTimeout(() => {
        setRequestingMentor(null);
      }, 1000);
    }
  };

  return (
    <MentorsContainer>
      <MentorsHeader>
        <Box>
          <Typography variant="h6" fontWeight={600} fontSize={16}>
            Available Mentors {filteredMentors.length > 0 && `(${filteredMentors.length})`}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            Connect with our experienced mentors to get guidance on your career journey
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchField
            placeholder="Search mentors..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: '200px' } }}
          />

          <StyledFormControl size="small" sx={{ width: { xs: '100%', sm: '180px' } }}>
            <InputLabel id="expertise-filter-label" sx={{ fontSize: '14px' }}>Expertise</InputLabel>
            <Select
              labelId="expertise-filter-label"
              id="expertise-filter"
              value={expertiseFilter}
              label="Expertise"
              onChange={handleExpertiseChange}
              sx={{ fontSize: '14px' }}
            >
              {expertiseAreas.map((area) => (
                <MenuItem key={area} value={area} sx={{ fontSize: '14px' }}>{area}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Box>
      </MentorsHeader>

      <MentorsContent id="mentors-grid">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : filteredMentors.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {paginatedMentors.map((mentor) => (
                <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                  <MentorCard 
                    mentor={mentor} 
                    handleRequestSession={handleRequest}
                    isRequesting={requestingMentor === mentor.email}
                  />
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary"
                  size="medium"
                />
              </Box>
            )}
          </>
        ) : (
          <NoMentorsMessage>
            <Typography variant="body1" gutterBottom>
              No mentors match your search criteria.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search query.
            </Typography>
          </NoMentorsMessage>
        )}
      </MentorsContent>
    </MentorsContainer>
  );
};

export default MentorsGrid;