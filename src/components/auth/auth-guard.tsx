import { CheckSquare, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { LoginButton } from "./login-button";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-8 bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <CheckSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-3xl text-foreground">TaskMaster</h1>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Gerencie suas tarefas de forma simples e eficiente
            </p>
          </div>
        </div>
        <LoginButton />
      </div>
    );
  }

  return <>{children}</>;
}
