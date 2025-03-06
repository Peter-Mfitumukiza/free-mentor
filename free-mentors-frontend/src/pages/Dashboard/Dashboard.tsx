import React, { useEffect, useState } from "react";
import { useAuth, UserRole } from "../../contexts/AuthContext";
import { getAllUsers, requestSession } from "../../api/graphqlApi";
import toast from "react-hot-toast";

interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  expertise?: string;
}

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
          const result = await requestSession(mentorEmail, token);
          console.log("Response we have in requesting the session", result);

          if(result.success) toast.success("Session request sent successfully");
          
          // if (result.success) {
          //   const userData = {
          //     firstName: "",
          //     lastName: "",
          //     email: formData.email,
          //     role: "USER",
          //   };
            
          //   login(result.token, userData);
            
          // } else {
          //   setError(result.message || "Login failed. Please check your credentials.");
          // }
        } catch (error) {
          console.error("Request session error:", error);
          setError(error instanceof Error ? error.message : "An error occurred during session request.");
        } finally {
          setLoading(false);
        }
    
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.firstName || "User"}!
        </h1>
        <p className="text-gray-600">
          {user?.role === UserRole.MENTOR
            ? "You are signed in as a mentor. You can help users with their career questions."
            : "Find a mentor to help guide your career journey."}
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Available Mentors</h2>

        {mentors.length === 0 ? (
          <p className="text-gray-500">No mentors available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white shadow rounded-lg p-6 border border-gray-100"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  {mentor.firstName} {mentor.lastName}
                </h3>
                <p className="text-blue-600 text-sm mb-3">
                  {mentor.expertise || "General Mentoring"}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {mentor.bio || "No bio available"}
                </p>
                <button onClick={() => handleRequestSession(mentor?.email)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors">
                  Request Session
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
