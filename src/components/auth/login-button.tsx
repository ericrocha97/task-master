import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function LoginButton() {
  const { signInWithGitHub, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGitHub();
    } catch {
      // Error already handled in context with toast
    }
  };

  return (
    <Button
      className="gap-2"
      disabled={loading}
      onClick={handleLogin}
      size="lg"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Github className="h-5 w-5" />
      )}
      Entrar com GitHub
    </Button>
  );
}
