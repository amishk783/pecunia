import { supabase } from "@/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (new_password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  logIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user as User);
      if (error) throw new Error(error.message);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      });
      return () => {
        subscription.unsubscribe();
      };
    };
    loadSession();
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:5173/update-password`,
    });
    if (error) {
      throw new Error(error.message);
    }
  };
  const updatePassword = async (new_password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
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
