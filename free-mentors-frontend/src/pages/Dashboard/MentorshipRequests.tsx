import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
  Tab
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SidebarLayout from "../../components/atoms/sidebar/Sidebar";
import { toast } from "react-hot-toast";
import { respondToMentorshipSession, getMySessions } from "../../api/graphqlApi";
import { AccessTime, Email, Person, Schedule } from "@mui/icons-material";

// Define the session interface based on the GraphQL schema
interface MentorshipSession {
  id: string;
  createdAt: string;
  status: string;
  mentee: {
    firstName: string;
    lastName: string;
    email: string;
    expertise?: string;
    occupation?: string;
  };
}

// Define the filter tabs
type FilterTab = 'all' | 'pending' | 'accepted' | 'REJECTED';

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

const RequestCard = styled(Card)({
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

const ActionButton = styled(Button)({
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '13px',
  padding: '6px 12px',
});

const IconTextItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
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

const MentorshipRequests: React.FC = () => {
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    if (token && user?.role === "MENTOR") {
      fetchMentorshipSessions();
    }
  }, [token, user]);

  const fetchMentorshipSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await getMySessions(token!);
      setSessions(sessionsData);
      setError(null);
    } catch (err) {
      setError("Failed to load mentorship requests. Please try again later.");
      console.error("Error fetching mentorship sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (sessionId: string, action: string) => {
    setActionInProgress(sessionId);
    try {
      // Convert to uppercase for backend compatibility
      const actionUppercase = action.toUpperCase();
      
      console.log(`Responding to session ${sessionId} with action: ${actionUppercase}`);
      const result = await respondToMentorshipSession(actionUppercase, sessionId, token!);
      
      if (result.success) {
        toast.success(`Mentorship request ${action === 'accept' ? 'accepted' : 'reject'} successfully!`);
        // Update local state to reflect the change
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session.id === sessionId 
              ? { ...session, status: action === 'accept' ? 'ACCEPTED' : 'reject' } 
              : session
          )
        );
      } else {
        toast.error(result.message || `Failed to ${action} mentorship request`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${action}ing the mentorship request`);
      console.error(`Error ${action}ing mentorship request:`, error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: FilterTab) => {
    setActiveTab(newValue);
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
      case 'rejected':
        return {
          label: 'REJECTED',
          sx: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }
        };
      default:
        return {
          label: status,
          sx: { bgcolor: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', border: '1px solid rgba(107, 114, 128, 0.2)' }
        };
    }
  };

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

  // Filter sessions based on active tab
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
  const pendingCount = sessions.filter(session => 
    session.status.toLowerCase() === 'pending'
  ).length;
  
  const acceptedCount = sessions.filter(session => 
    session.status.toLowerCase() === 'accepted'
  ).length;
  
  const declinedCount = sessions.filter(session => 
    session.status.toLowerCase() === 'declined'
  ).length;

  return (
    <SidebarLayout>
      <PageContainer>
        <HeaderSection>
          <Typography variant="h6" fontWeight={600} fontSize={16}>
            Mentorship Requests
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={13} sx={{ mt: 0.5 }}>
            Manage mentorship session requests from mentees
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

        {/* Filter tabs */}
        <Paper sx={{ boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <StyledTabs 
            value={activeTab} 
            onChange={handleChangeTab}
            aria-label="request filter tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <StyledTab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  All
                  <CountBadge sx={{ bgcolor: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }}>
                    {sessions.length}
                  </CountBadge>
                </Box>
              } 
              value="all" 
            />
            <StyledTab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Pending
                  <CountBadge sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                    {pendingCount}
                  </CountBadge>
                </Box>
              } 
              value="pending" 
            />
            <StyledTab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Accepted
                  <CountBadge sx={{ bgcolor: 'rgba(22, 163, 74, 0.1)', color: '#16a34a' }}>
                    {acceptedCount}
                  </CountBadge>
                </Box>
              } 
              value="accepted" 
            />
            <StyledTab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Declined
                  <CountBadge sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                    {declinedCount}
                  </CountBadge>
                </Box>
              } 
              value="declined" 
            />
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
                    <RequestCard>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} fontSize={15}>
                            Request from {session.mentee.firstName} {session.mentee.lastName}
                          </Typography>
                          <StatusChip {...getStatusChipProps(session.status)} size="small" />
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <IconTextItem>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2" fontSize={13}>
                            {session.mentee.email}
                          </Typography>
                        </IconTextItem>
                        
                        {session.mentee.occupation && (
                          <IconTextItem>
                            <Person fontSize="small" color="action" />
                            <Typography variant="body2" fontSize={13}>
                              {session.mentee.occupation}
                            </Typography>
                          </IconTextItem>
                        )}
                        
                        <IconTextItem>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" fontSize={13}>
                            Requested on {formatDate(session.createdAt)}
                          </Typography>
                        </IconTextItem>
                        
                        {session.mentee.expertise && (
                          <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="body2" fontSize={13} color="text.secondary" gutterBottom>
                              Expertise:
                            </Typography>
                            <Chip 
                              label={session.mentee.expertise} 
                              size="small" 
                              sx={{ 
                                fontSize: '12px', 
                                backgroundColor: 'rgba(37, 99, 235, 0.1)', 
                                color: '#2563eb' 
                              }} 
                            />
                          </Box>
                        )}
                        
                        {session.status.toLowerCase() === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            <ActionButton
                              variant="contained"
                              color="primary"
                              onClick={() => handleRespondToRequest(session.id, 'accept')}
                              disabled={actionInProgress === session.id}
                              fullWidth
                            >
                              Accept
                            </ActionButton>
                            
                            <ActionButton
                              variant="outlined"
                              color="error"
                              onClick={() => handleRespondToRequest(session.id, 'reject')}
                              disabled={actionInProgress === session.id}
                              fullWidth
                            >
                              Decline
                            </ActionButton>
                          </Box>
                        )}
                        
                        {session.status.toLowerCase() === 'accepted' && (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ mt: 3, textTransform: 'none', fontSize: '13px' }}
                            fullWidth
                            disabled
                          >
                            Accepted
                          </Button>
                        )}
                        
                        {session.status.toLowerCase() === 'declined' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ mt: 3, textTransform: 'none', fontSize: '13px' }}
                            fullWidth
                            disabled
                          >
                            Declined
                          </Button>
                        )}
                      </CardContent>
                    </RequestCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                <Schedule fontSize="large" color="disabled" sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary" fontSize={16}>
                  {activeTab === 'all' 
                    ? "No mentorship requests yet" 
                    : `No ${activeTab} mentorship requests`}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize={14} sx={{ mt: 1 }}>
                  {activeTab === 'all' 
                    ? "When mentees request sessions with you, they will appear here" 
                    : `Switch to a different tab to view other requests`}
                </Typography>
              </Box>
            )}
          </>
        )}
      </PageContainer>
    </SidebarLayout>
  );
};

export default MentorshipRequests;