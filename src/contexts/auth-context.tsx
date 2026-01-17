import {
  signOut as firebaseSignOut,
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { auth, githubProvider } from "@/lib/firebase";
import type { AuthState, AuthUser } from "@/types/user";

interface AuthContextType extends AuthState {
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapFirebaseUser(
  user: User | null,
  username: string | null
): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    displayName: user.displayName,
    username,
    photoURL: user.photoURL,
    providerId: user.providerId,
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Retrieve cached username from localStorage
        const username = localStorage.getItem(
          `github-username-${firebaseUser.uid}`
        );

        setState({
          user: mapFirebaseUser(firebaseUser, username),
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGitHub = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await signInWithPopup(auth, githubProvider);

      // Extract GitHub access token from credential
      const credential = GithubAuthProvider.credentialFromResult(result);
      if (credential?.accessToken && result.user) {
        // Fetch GitHub username via API
        const response = await fetch("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${credential.accessToken}` },
        });

        if (response.ok) {
          const githubUser = await response.json();
          // Cache username in localStorage for future sessions
          localStorage.setItem(
            `github-username-${result.user.uid}`,
            githubUser.login
          );

          // Update state with username
          setState((prev) => ({
            ...prev,
            user: prev.user
              ? { ...prev.user, username: githubUser.login }
              : null,
          }));
        }
      }

      toast.success("Login realizado com sucesso!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao fazer login";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      toast.error("Falha no login", { description: message });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao sair";
      setState((prev) => ({ ...prev, error: message }));
      toast.error("Falha no logout", { description: message });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
