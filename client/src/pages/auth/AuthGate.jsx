import { useState } from "react";
import auth from "../../dummy/auth";
import MainContainer from "../layouts/MainLayout";
import { Navigate } from "react-router-dom";
const AuthGate = () => {
  const [info, setInfo] = useState(auth);
  // query to get user data
  // - check for auth token
  // - if auth token exists, redirect to dashboard
  //    - then query to get user data
  //    - store in zustand
  // - if auth token doesn't exist, redirect to sign-in

  return info ? <MainContainer /> : <Navigate to={"/sign-in"} />;
};

export default AuthGate;
