import { supabase } from "@/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;

  resetPassword: (email: string) => Promise<void>;
  updatePassword: (new_password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: false,
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
  console.log("🚀 ~ setUser:", setUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (error) throw new Error(error.message);

      setSession(data.session);
      setUser(data.session?.user as User);

      setLoading(false);
    };
    loadSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log("🚀 ~ signUp ~ error:", error);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
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
