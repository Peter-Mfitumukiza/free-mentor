import React, { useState, FormEvent, ChangeEvent } from "react";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { PrimaryInput } from "../../atoms/inputs/TextInput";
import { RegisterForm } from "./Register";
import { useAuth } from "../../../contexts/AuthContext";
import { loginUser } from "../../../api/graphqlApi";

interface LoginFormProps {
  updateRightContent: (content: React.ReactNode) => void;
  handleBackNavigation?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  updateRightContent,
  handleBackNavigation 
}) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
    setLoading(true);
    setError(null);

    try {
      const result = await loginUser(formData.email, formData.password);
      console.log("Response we have in logging in the user", result);
      
      if (result.success) {
        const userData = {
          firstName: "",
          lastName: "",
          email: formData.email,
          role: "USER",
        };
        
        login(result.token, userData);
        // window.location.href = "/dashboard";
      } else {
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    updateRightContent(<RegisterForm updateRightContent={updateRightContent} />);
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold mb-3 text-text-primary">Login</h2>
      <p className="mb-8 text-text-secondary text-xs">
        Enter your login credentials to access your account
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <PrimaryInput
            label="Email"
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

        <div>
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

        <PrimaryButton 
          type="submit" 
          variant="contained" 
          fullWidth 
          size="large" 
          className="mt-4"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </PrimaryButton>
      </form>

      <div className="text-center mt-10">
        <p className="text-text-secondary text-xs mb-2">
          Don't have an account?{" "}
          
          <a href="#"
            onClick={handleCreateAccount}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};