
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export type UserRole = "SUPER_ADMIN" | "MANAGER" | "TENANT";
export type Language = "en" | "fr";

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("preferred_lang") as Language) || "en";
  });

  const login = async (email: string) => {
    // 1. Special case for SuperAdmin
    if (email.toLowerCase() === 'rdtb1418@gmail.com') {
      const superAdmin: User = {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Master Admin',
        role: 'SUPER_ADMIN',
        email
      };
      setUser(superAdmin);
      localStorage.setItem("auth_email", email);
      return true;
    }

    try {
      // 2. Check Profiles Table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || email.split('@')[0],
          role: profile.role as UserRole,
          email: profile.email
        });
        localStorage.setItem("auth_email", email);
        return true;
      }

      // 3. Fallback: Check managers table
      const { data: manager } = await supabase
        .from('managers')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (manager) {
        setUser({
          id: manager.id,
          name: manager.name,
          role: (manager.role as UserRole) || 'MANAGER',
          email: manager.email
        });
        localStorage.setItem("auth_email", email);
        return true;
      }

      // 4. Fallback: Check tenants table
      const { data: tenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (tenant) {
        setUser({
          id: tenant.id,
          name: tenant.name,
          role: 'TENANT',
          email: tenant.email
        });
        localStorage.setItem("auth_email", email);
        return true;
      }

      toast.error("User not assigned to any role. Contact support.");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_email");
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred_lang", lang);
    toast.success(lang === 'en' ? "Language set to English" : "Langue réglée sur Français");
  };

  // Listen for Supabase Auth changes
  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        await login(session.user.email);
      } else {
        const savedEmail = localStorage.getItem("auth_email");
        if (savedEmail) {
          await login(savedEmail);
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        await login(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      language,
      setLanguage: handleLanguageChange
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
