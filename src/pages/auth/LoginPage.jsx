import React from "react";
import AuthWrapper from "../../components/auth/AuthWrapper";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => (
  <AuthWrapper requireAuth={false}>
    <LoginForm />
  </AuthWrapper>
);

export default LoginPage;
