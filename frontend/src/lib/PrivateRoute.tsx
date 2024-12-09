import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "./providers/AuthProvider";

const PrivateRoute: React.FC = () => {
  const { user, loading, session } = useAuth();
  console.log("🚀 ~ user:", user);

  console.log("🚀 ~ loading:", loading);
  console.log("🚀 ~ user:", user);

  if (!loading) {
    // console.log("🚀 ~private loading:", loading)
    return (
      <div className="w-full h-screen absolute -ml-56 items-center justify-center bg-white ">
        <div className="w-full items-center translate-x-1/2 h-screen translate-y-1/2  justify-center">
          Loading...
        </div>
      </div>
    ); // Or a more sophisticated loading spinner
  }

  return user || session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
