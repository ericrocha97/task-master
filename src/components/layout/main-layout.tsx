import type { ReactNode } from "react";

interface MainLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function MainLayout({ sidebar, children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {sidebar}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
