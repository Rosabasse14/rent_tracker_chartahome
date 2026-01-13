
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

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
  login: (email: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const MOCK_USERS: User[] = [
  { id: "1", name: "Alpha Admin", role: "SUPER_ADMIN", email: "admin@chartahome.cm" },
  { id: "2", name: "Bonamoussadi Rentals", role: "MANAGER", email: "manager@rentals.cm" },
  { id: "3", name: "Ngon Simo Nathan", role: "TENANT", email: "nathanngon71@gmail.com" },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("preferred_lang") as Language) || "en";
  });

  const login = (email: string) => {
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("auth_email", email);
      return true;
    }

    toast.error("User not found. Try admin@chartahome.cm, manager@rentals.cm, or nathanngon71@gmail.com");
    return false;
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

  // Restore session
  useEffect(() => {
    const savedEmail = localStorage.getItem("auth_email");
    if (savedEmail) {
      login(savedEmail);
    }
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
      {children}
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
