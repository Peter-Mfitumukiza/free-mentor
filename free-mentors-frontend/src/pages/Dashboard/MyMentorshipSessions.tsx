import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress, 
  Alert, 
  Chip, 
  Grid, 
  Divider, 
  Paper,
  Tabs,
  Tab,
  Avatar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SidebarLayout from "../../components/atoms/sidebar/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { 
  getMySessions, 
  respondToMentorshipSession 
} from "../../api/graphqlApi";
import { 
  AccessTime, 
  Schedule, 
  CheckCircle, 
  CancelOutlined 
} from "@mui/icons-material";
import { toast } from "react-hot-toast";

// Shared Interfaces
interface MentorshipSession {
  id: string;
  createdAt: string;
  status: string;
  mentee?: {
    firstName: string;
    lastName: string;
    email: string;
    expertise?: string;
    occupation?: string;
  };
  mentor?: {
    firstName: string;
    lastName: string;
    email: string;
    expertise?: string;
    occupation?: string;
  };
}

type FilterTab = 'all' | 'pending' | 'accepted' | 'declined' | 'completed';

// Styled Components
const PageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingTop: "16px",
  paddingBottom: "32px",
});

const HeaderSection = styled(Paper)({
  borderRadius: '10px',
  boxShadow: 'none',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  backgroundColor: '#f5f7fa',
  padding: '20px 24px',
  marginBottom: '16px',
});

const SessionCard = styled(Card)({
  borderRadius: '10px',
  boxShadow: 'none',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: '#bfdbfe',
  }
});

const StatusChip = styled(Chip)({
  borderRadius: '16px',
  fontSize: '0.75rem',
  height: '24px',
  fontWeight: 500,
});

const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid #e5e7eb',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1A5FFF',
    height: 3,
  },
});

const StyledTab = styled(Tab)({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  minWidth: 100,
  '&.Mui-selected': {
    color: '#1A5FFF',
  },
});

const CountBadge = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  fontSize: '12px',
  padding: '2px 8px',
  marginLeft: '8px',
  fontWeight: 600,
});

const MentorAvatar = styled(Avatar)({
  width: 60,
  height: 60,
  backgroundColor: 'rgba(26, 95, 255, 0.1)',
  color: '#1A5FFF',
  fontSize: '1.5rem',
  fontWeight: 600,
  marginRight: '16px',
});

// Utility Functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusChipProps = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'pending':
      return {
        label: 'Pending',
        sx: { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }
      };
    case 'accepted':
      return {
        label: 'Accepted',
        sx: { bgcolor: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', border: '1px solid rgba(22, 163, 74, 0.2)' }
      };
    case 'declined':
      return {
        label: 'Declined',
        sx: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }
      };
    case 'completed':
      return {
        label: 'Completed',
        sx: { bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', border: '1px solid rgba(79, 70, 229, 0.2)' }
      };
    default:
      return {
        label: status,
        sx: { bgcolor: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', border: '1px solid rgba(107, 114, 128, 0.2)' }
      };
  }
};

// Main Component
const MyMentorshipSessions: React.FC = () => {
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    if (token) {
      fetchMentorshipSessions();
    }
  }, [token, user]);

  const fetchMentorshipSessions = async () => {
    try {
      setLoading(true);
      // Determine role-based session fetching
      const roleType = user?.role === 'MENTOR' ? 'MENTOR' : 'MENTEE';
      const sessionsData = await getMySessions(token!, roleType);
      setSessions(sessionsData);
      setError(null);
    } catch (err) {
      setError("Failed to load your mentorship sessions. Please try again later.");
      console.error("Error fetching mentorship sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle session response for mentors
  const handleSessionResponse = async (sessionId: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      const response = await respondToMentorshipSession(action, sessionId, token!);
      
      if (response.success) {
        toast.success(response.message);
        // Refresh sessions after successful response
        fetchMentorshipSessions();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Failed to respond to session request");
      console.error("Session response error:", err);
    }
  };

  const getFilteredSessions = () => {
    if (activeTab === 'all') {
      return sessions;
    }
    return sessions.filter(session => 
      session.status.toLowerCase() === activeTab.toLowerCase()
    );
  };

  const filteredSessions = getFilteredSessions();
  
  // Count sessions for each category
  const sessionCounts = {
    all: sessions.length,
    pending: sessions.filter(s => s.status.toLowerCase() === 'pending').length,
    accepted: sessions.filter(s => s.status.toLowerCase() === 'accepted').length,
    declined: sessions.filter(s => s.status.toLowerCase() === 'declined').length,
    completed: sessions.filter(s => s.status.toLowerCase() === 'completed').length,
  };

  // Determine the view based on user role
  const isMentor = user?.role === 'MENTOR';

  return (
    <SidebarLayout>
      <PageContainer>
        <HeaderSection>
          <Typography variant="h6" fontWeight={600} fontSize={16}>
            {isMentor ? 'Mentorship Requests' : 'My Mentorship Sessions'}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={13} sx={{ mt: 0.5 }}>
            {isMentor 
              ? 'View and manage mentorship requests' 
              : 'View your mentorship session requests'}
          </Typography>
        </HeaderSection>

        {error && (
          <Alert 
            severity="error" 
            sx={{ borderRadius: '6px', boxShadow: 'none', border: '1px solid #FECACA', mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Paper sx={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <StyledTabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="session filter tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {['all', 'pending', 'accepted', 'declined', 'completed'].map(tab => (
              <StyledTab 
                key={tab}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <CountBadge sx={{ 
                      bgcolor: `rgba(107, 114, 128, 0.1)`, 
                      color: '#6b7280' 
                    }}>
                      {sessionCounts[tab as keyof typeof sessionCounts]}
                    </CountBadge>
                  </Box>
                } 
                value={tab} 
              />
            ))}
          </StyledTabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#1A5FFF' }} />
          </Box>
        ) : (
          <>
            {filteredSessions.length > 0 ? (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {filteredSessions.map((session) => (
                  <Grid item xs={12} sm={6} md={4} key={session.id}>
                    <SessionCard>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MentorAvatar 
                              sx={{ 
                                bgcolor: '#1A5FFF', 
                                fontWeight: 500 
                              }}
                            >
                              {isMentor 
                                ? `${session.mentee?.firstName[0] || ''}${session.mentee?.lastName[0] || ''}` 
                                : `${session.mentor?.firstName[0] || ''}${session.mentor?.lastName[0] || ''}`
                              }
                            </MentorAvatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600} fontSize={15}>
                                {isMentor 
                                  ? `${session.mentee?.firstName || 'Unknown'} ${session.mentee?.lastName || 'Mentee'}`
                                  : `${session.mentor?.firstName || 'Unknown'} ${session.mentor?.lastName || 'Mentor'}`
                                }
                              </Typography>
                              {(isMentor ? session.mentee?.expertise : session.mentor?.expertise) && (
                                <Typography variant="caption" color="text.secondary" fontSize={12}>
                                  {isMentor ? session.mentee?.expertise : session.mentor?.expertise}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <StatusChip {...getStatusChipProps(session.status)} size="small" />
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2" fontSize={13}>
                              Requested on {formatDate(session.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Mentor View - Ability to Accept/Decline */}
                        {isMentor && session.status.toLowerCase() === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              sx={{ flex: 1, borderRadius: '6px', textTransform: 'none', fontSize: '13px' }}
                              onClick={() => handleSessionResponse(session.id, 'ACCEPT')}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<CancelOutlined />}
                              sx={{ flex: 1, borderRadius: '6px', textTransform: 'none', fontSize: '13px' }}
                              onClick={() => handleSessionResponse(session.id, 'DECLINE')}
                            >
                              Decline
                            </Button>
                          </Box>
                        )}

                        {/* Mentee View - Different Status Displays */}
                        {!isMentor && (
                          <>
                            {session.status.toLowerCase() === 'pending' && (
                              <Box sx={{ display: 'flex', mt: 3 }}>
                                <Button
                                  variant="outlined"
                                  color="warning"
                                  size="small"
                                  startIcon={<Schedule />}
                                  sx={{ borderRadius: '6px', textTransform: 'none', fontSize: '13px' }}
                                  fullWidth
                                  disabled
                                >
                                  Awaiting Mentor Response
                                </Button>
                              </Box>
                            )}
                            
                            {session.status.toLowerCase() === 'accepted' && (
                              <Box sx={{ display: 'flex', mt: 3 }}><Button
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{ borderRadius: '6px', textTransform: 'none', fontSize: '13px' }}
                              fullWidth
                            >
                              Contact Mentor
                            </Button>
                          </Box>
                        )}
                        
                        {session.status.toLowerCase() === 'declined' && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<CancelOutlined />}
                              sx={{ borderRadius: '6px', textTransform: 'none', fontSize: '13px' }}
                              fullWidth
                              disabled
                            >
                              Request Declined
                            </Button>
                          </Box>
                        )}

                        {session.status.toLowerCase() === 'completed' && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<CheckCircle />}
                              sx={{ borderRadius: '6px', textTransform: 'none', fontSize: '13px' }}
                              fullWidth
                              disabled
                            >
                              Session Completed
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </CardContent>
                </SessionCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <Schedule fontSize="large" color="disabled" sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontSize={16}>
              {activeTab === 'all' 
                ? (isMentor ? "No mentorship requests" : "No mentorship sessions yet")
                : `No ${activeTab} ${isMentor ? 'requests' : 'sessions'}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize={14} sx={{ mt: 1 }}>
              {activeTab === 'all' 
                ? (isMentor 
                    ? "Waiting for mentees to request sessions" 
                    : "Request a mentorship session to get started")
                : `Switch to a different tab to view other ${isMentor ? 'requests' : 'sessions'}`}
            </Typography>
          </Box>
        )}
      </>
    )}
  </PageContainer>
</SidebarLayout>
);
};

export default MyMentorshipSessions;