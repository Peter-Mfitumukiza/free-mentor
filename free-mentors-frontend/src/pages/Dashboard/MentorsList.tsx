import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllUsers } from "../../api/graphqlApi";

interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  expertise?: string;
  occupation?: string;
}

const MentorsList: React.FC = () => {
  const { token } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("");

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

  // Get unique expertise values for filtering
  const expertiseOptions = React.useMemo(() => {
    const options = new Set<string>();
    mentors.forEach((mentor) => {
      if (mentor.expertise) {
        mentor.expertise.split(",").forEach((exp) => options.add(exp.trim()));
      }
    });
    return Array.from(options).sort();
  }, [mentors]);

  // Filter mentors based on search term and expertise
  const filteredMentors = React.useMemo(() => {
    return mentors.filter((mentor) => {
      const matchesSearch =
        searchTerm === "" ||
        `${mentor.firstName} ${mentor.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.occupation?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesExpertise =
        expertiseFilter === "" ||
        mentor.expertise?.toLowerCase().includes(expertiseFilter.toLowerCase());

      return matchesSearch && matchesExpertise;
    });
  }, [mentors, searchTerm, expertiseFilter]);

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
        <h1 className="text-2xl font-bold text-gray-800">Find a Mentor</h1>
        <p className="text-gray-600">
          Connect with experienced professionals who can guide your career
          journey
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search mentors by name or keywords..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
          >
            <option value="">All Expertise</option>
            {expertiseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredMentors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No mentors match your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setExpertiseFilter("");
            }}
            className="mt-4 text-blue-500 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white shadow rounded-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800">
                  {mentor.firstName} {mentor.lastName}
                </h3>
                <p className="text-blue-600 text-sm mb-1">
                  {mentor.occupation || "Mentor"}
                </p>
                <div className="mb-4">
                  {mentor.expertise?.split(",").map((exp, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2"
                    >
                      {exp.trim()}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {mentor.bio || "No bio available"}
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorsList;
