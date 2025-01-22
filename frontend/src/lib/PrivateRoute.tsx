import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "./stores/AuthProvider";

const PrivateRoute: React.FC = () => {
  const { user, loading, session } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen absolute left-0 top-0 items-center justify-center bg-white ">
        <div className="w-full flex items-center h-full   justify-center">
          Loading...
        </div>
      </div>
    ); // Or a more sophisticated loading spinner
  }

  return user || session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
