import React, { useState } from "react";
import { useAuth, UserRole } from "../../contexts/AuthContext";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    address: user?.address || "",
    occupation: user?.occupation || "",
    expertise: user?.expertise || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile update submitted:", formData);
    // Implement API call to update profile
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {user?.role}
                </span>
              </div>
            </div>

            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>

              <button
                onClick={logout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Separate multiple skills with commas"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-gray-600 text-sm mb-2">Bio</h3>
                <p>{user?.bio || "No bio information provided"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-600 text-sm mb-2">Occupation</h3>
                  <p>{user?.occupation || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-gray-600 text-sm mb-2">Address</h3>
                  <p>{user?.address || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-gray-600 text-sm mb-2">Expertise</h3>
                  <p>{user?.expertise || "Not specified"}</p>
                </div>

                {user?.role === UserRole.MENTOR && (
                  <div>
                    <h3 className="text-gray-600 text-sm mb-2">
                      Mentorship Status
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
