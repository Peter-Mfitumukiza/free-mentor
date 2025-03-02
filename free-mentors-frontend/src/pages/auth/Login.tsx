import React from "react";
import { AuthLayout } from "../../components/organisms/AuthLayout";
import { LoginForm } from "../../components/organisms/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm onToggle={() => {}} />
    </AuthLayout>
  );
};

export default Login;
