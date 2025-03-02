import React from "react";
import { AuthLayout } from "../../components/organisms/AuthLayout";
import { RegisterForm } from "../../components/organisms/auth/Register";

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterForm onToggle={() => {}} />
    </AuthLayout>
  );
};

export default Register;