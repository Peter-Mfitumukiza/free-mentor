import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllUsers, requestSession } from "../../api/graphqlApi";
import { Box, CircularProgress, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import SidebarLayout from "../../components/atoms/sidebar/Sidebar";
import WelcomeSection from "../../components/molecules/cards/WelcomeSection";
import MentorsGrid from "../../components/molecules/cards/MentorsGrid";
import { toast } from "react-hot-toast";

interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  expertise?: string;
}

const PageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingTop: "16px",
  paddingBottom: "32px",
});

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchMentors();
    }
  }, [token]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      console.log("Fetching mentors list");
      const mentorsData = await getAllUsers(token!, "MENTOR");
      setMentors(mentorsData);
    } catch (err) {
      setError("Failed to load mentors. Please try again later.");
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSession = async (mentorEmail: string) => {
    try {
      const result = await requestSession(mentorEmail, token!);
      
      if (result && result.success) {
        toast.success("Session request sent successfully!");
        return true;
      } else {
        const errorMessage = result?.message || "Failed to send session request";
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during session request.";
      toast.error(errorMessage);
      console.error("Error requesting session:", error);
      return false;
    }
  };

  return (
    <SidebarLayout>
      <PageContainer>
        <WelcomeSection
          userName={user?.firstName || "User"}
          userRole={user?.role}
          refreshData={fetchMentors}
          isLoading={loading}
        />
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <MentorsGrid
            mentors={mentors}
            isLoading={loading}
            error={error}
            handleRequestSession={handleRequestSession}
          />
        )}
      </PageContainer>
    </SidebarLayout>
  );
};

export default Dashboard;