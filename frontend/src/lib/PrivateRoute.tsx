import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "./providers/AuthProvider";

import { Loader2 } from "lucide-react";

const PrivateRoute: React.FC = () => {
  const { user, session, loading } = useAuth();
  const [isUserChecked, setIsUserChecked] = useState(false);


  useEffect(() => {
    if (!loading) {
      setIsUserChecked(true);
    }
  }, [loading]);

  if (loading || !isUserChecked) {
    return (
      <div className="m-auto flex items-center justify-center h-screen ">
        <Loader2 className="animate-spin " size={42} />
      </div>
    );
  }

  return user || session?.access_token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
