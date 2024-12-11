import { updateAxiosToken } from "@/services/api";
import { supabase } from "@/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateIsAuth: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (new_password: string) => Promise<void>;
  isAuth: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: false,
  updateIsAuth: () => {},
  logIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  isAuth: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (error) throw new Error(error.message);

      if (!data.session) navigate("/login");
      setSession(data.session);
      setUser(data.session?.user as User);

      if (data.session && data.session.access_token)
        updateAxiosToken(data.session?.access_token);

      setLoading(false);
    };
    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) setUser(session?.user);
      
      if (session && session.access_token)
        updateAxiosToken(session?.access_token);

      setIsAuth(session && !loading ? true : false);
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      throw new Error(error.message);
    }
  };
  const logIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      throw new Error(error.message);
    }
  };
  const logOut = async () => {
    navigate("/login");
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  };
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:5173/update-password`,
    });
    if (error) {
      throw new Error(error.code);
    }
  };
  const updatePassword = async (new_password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });
    if (error) {
      throw new Error(error.code);
    }
  };

  const updateIsAuth = () => {
    setIsAuth((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        updateIsAuth,
        signUp,
        isAuth,
        logIn,
        logOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
