import React, { useState, FormEvent, ChangeEvent } from "react";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { PrimaryInput } from "../../atoms/inputs/TextInput";
import { RegistrationSteps } from "./RegistrationStep";
import { LoginForm } from "./LoginForm";
import { registerUser } from "../../../api/graphqlApi";
import { toast } from "react-hot-toast";

interface RegisterFormProps {
  updateRightContent: (content: React.ReactNode) => void;
  parentHandleBackNavigation?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  updateRightContent,
  parentHandleBackNavigation 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    address: "",
    occupation: "",
    expertise: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        bio: formData.bio || undefined,
        address: formData.address || undefined,
        occupation: formData.occupation || undefined,
        expertise: formData.expertise || undefined,
      });
      
      if (result.success) {
      toast.success(result.message || "Registration successful! Please login.");
        updateRightContent(<LoginForm updateRightContent={updateRightContent} />);
      } else {
        setError(result.message || "Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : "An error occurred during registration.");
      toast.error("An error occured during registration")
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };
  
  const handleBackNavigation = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      updateRightContent(<LoginForm updateRightContent={updateRightContent} />);
    }
  };
  
  React.useEffect(() => {
    if (parentHandleBackNavigation) {
      (window as any).customBackNavigation = handleBackNavigation;
    }
  }, [currentStep, parentHandleBackNavigation]);

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold text-text-primary mb-3">Create Account</h2>
      <p className="mb-10 text-text-secondary text-xs">Fill in your details to create an account</p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {currentStep === 1 && (
          <>
            <div className="mb-8">
              <PrimaryInput
                label="First Name"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <PrimaryInput
                label="Last Name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <PrimaryInput
                label="Email Address"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <PrimaryButton 
              type="button" 
              variant="contained" 
              fullWidth 
              size="large" 
              onClick={handleNext} 
              className="mt-4"
              disabled={loading}
            >
              Next
            </PrimaryButton>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="mb-8">
              <PrimaryInput
                label="Password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <PrimaryInput
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <PrimaryInput
                label="Bio (Optional)"
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <PrimaryInput
                label="Address (Optional)"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <PrimaryInput
                label="Occupation (Optional)"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="mb-8">
              <PrimaryInput
                label="Expertise (Optional)"
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                fullWidth
                className="w-full text-sm"
                disabled={loading}
              />
            </div>

            <div className="flex space-x-4 mt-4">
              <PrimaryButton 
                type="button" 
                variant="outlined" 
                fullWidth 
                size="large" 
                onClick={handlePrevious}
                disabled={loading}
              >
                Previous
              </PrimaryButton>
              
              <PrimaryButton 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </PrimaryButton>
            </div>
          </>
        )}
      </form>
      
      <div className="mt-12">
        <RegistrationSteps currentStep={currentStep} totalSteps={2} />
      </div>
    </div>
  );
};