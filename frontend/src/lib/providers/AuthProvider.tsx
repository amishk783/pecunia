import { defaultAvatarUrls } from "@/constants/constants";
import { updateAxiosToken } from "@/services/api";
import { supabase } from "@/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuth: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAuth: (isAuth: boolean) => void;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (new_password: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
}
export const useAuth = create<AuthState>()((set) => ({
  user: null,
  session: null,
  loading: true,
  isAuth: false,
  // State setters
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setIsAuth: (isAuth) => set({ isAuth }),

  // Initialize auth state
  initializeAuth: async () => {
    set({ loading: true });

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session && data.session.access_token) {
        updateAxiosToken(data.session.access_token);
        set({
          session: data.session,
          user: data.session.user,
          isAuth: true,
        });
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    } finally {
      set({ loading: false });
    }
  },
  updateIsAuth: () => {},
  logIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      throw new Error(error.message);
    }
  },
  signUp: async (email, password) => {
    const storageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/file`;
    const randomAvatar =
      defaultAvatarUrls[Math.floor(Math.random() * defaultAvatarUrls.length)];
    const avatarUrl = `${storageUrl}${randomAvatar}`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          avatar_url: avatarUrl,
        },
      },
    });

    if (error) throw new Error(error.message);
  },
  logOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);

    set({
      user: null,
      session: null,
      isAuth: false,
    });
  },
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:5173/update-password`,
    });

    if (error) throw new Error(error.code);
  },

  updatePassword: async (new_password) => {
    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (error) throw new Error(error.code);
  },
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((_event, session) => {
  const { setSession, setUser, setIsAuth } = useAuth.getState();

  if (session) {
    setSession(session);
    setUser(session.user);
    if (session.access_token) {
      updateAxiosToken(session.access_token);
    }
    setIsAuth(true);
  } else {
    setSession(null);
    setUser(null);
    setIsAuth(false);
  }
});
