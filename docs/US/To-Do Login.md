# US — Autenticação GitHub + Notas por Usuário

## 📋 User Story

**Como** usuário do app,  
**Quero** fazer login com minha conta do GitHub,  
**Para** poder acessar minhas notas pessoais de forma isolada e segura.

---

## ✅ Critérios de Aceitação

1. O usuário consegue autenticar usando GitHub via Firebase Auth
2. Após login, o app exibe nome, username (@handle) e foto do usuário
3. As notas são armazenadas e lidas apenas do usuário autenticado (por `uid`)
4. O usuário não consegue acessar notas de outro usuário
5. Ao sair da sessão, as notas não ficam visíveis

---

## 🏗️ Visão Geral da Arquitetura

### Stack Atual do Projeto

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.2.0 | UI Framework |
| Vite | rolldown-vite 7.2.5 | Build Tool |
| TypeScript | 5.9.3 | Type Safety |
| Tailwind CSS | 4.1.18 | Styling |
| Radix UI | various | Components |
| pnpm | - | Package Manager |

### Tecnologias a Adicionar

| Tecnologia | Propósito |
|------------|-----------|
| Firebase Auth | Autenticação GitHub OAuth |
| Firebase Firestore | Persistência de dados por usuário |

---

## 📁 Estrutura de Arquivos a Criar/Modificar

```
src/
├── lib/
│   └── firebase.ts              # [CRIAR] Configuração Firebase
├── contexts/
│   └── auth-context.tsx         # [CRIAR] Context de autenticação
├── hooks/
│   └── use-tasks.ts             # [MODIFICAR] Integrar com Firestore
├── components/
│   ├── auth/
│   │   ├── login-button.tsx     # [CRIAR] Botão de login GitHub
│   │   ├── user-menu.tsx        # [CRIAR] Menu do usuário logado
│   │   └── auth-guard.tsx       # [CRIAR] Proteção de rotas
│   └── layout/
│       └── sidebar.tsx          # [MODIFICAR] Exibir dados do usuário
├── types/
│   ├── task.ts                  # [EXISTENTE] Sem alterações
│   └── user.ts                  # [CRIAR] Tipos do usuário
└── app.tsx                      # [MODIFICAR] Adicionar AuthProvider
```

---

## 📦 Dependências Necessárias

```bash
pnpm add firebase
```

---

## 🔧 Implementação Detalhada

### 1. Configuração Firebase (`src/lib/firebase.ts`)

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const githubProvider = new GithubAuthProvider();

// Adicionar scope para ler dados do usuário
githubProvider.addScope("read:user");
```

### 2. Tipos do Usuário (`src/types/user.ts`)

```typescript
export interface AuthUser {
  uid: string;
  displayName: string | null;
  username: string | null;
  photoURL: string | null;
  providerId: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
```

### 3. Context de Autenticação (`src/contexts/auth-context.tsx`)

```typescript
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, githubProvider } from "@/lib/firebase";
import type { AuthUser, AuthState } from "@/types/user";

interface AuthContextType extends AuthState {
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapFirebaseUser(user: User | null, username: string | null): AuthUser | null {
  if (!user) return null;
  
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // O username pode ser extraído do photoURL do GitHub
        // Formato: https://avatars.githubusercontent.com/u/{id}?v=4
        // Ou armazenar durante o login (idealmente persistir também no Firestore)
        const username = localStorage.getItem(`github-username-${firebaseUser.uid}`);
        
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
      
      // Extrair username do GitHub via credential
      const credential = GithubAuthProvider.credentialFromResult(result);
      if (credential && result.user) {
        // Buscar username via GitHub API usando o access token
        const accessToken = credential.accessToken;
        if (accessToken) {
          const response = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const githubUser = await response.json();
          // Salvar username no localStorage para persistir
          localStorage.setItem(
            `github-username-${result.user.uid}`,
            githubUser.login
          );
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao sair";
      setState((prev) => ({ ...prev, error: message }));
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
```

### 4. Hook de Tasks com Firestore (`src/hooks/use-tasks.ts`)

**Alterações necessárias:**

- Substituir `useLocalStorage` por Firestore
- Usar o `uid` do usuário como path da collection
- Collection path: `users/{uid}/tasks`

```typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import type { FilterType, PriorityType, SortType, TagType, Task } from "@/types/task";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Listener em tempo real para tasks do usuário
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = useCallback(
    async (
      title: string,
      options?: { dueDate?: string; tag?: TagType; priority?: PriorityType }
    ) => {
      if (!user) throw new Error("User not authenticated");

      const tasksRef = collection(db, "users", user.uid, "tasks");
      const newTask = {
        title,
        completed: false,
        createdAt: serverTimestamp(),
        ...options,
      };

      const docRef = await addDoc(tasksRef, newTask);
      return { id: docRef.id, ...newTask };
    },
    [user]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      if (!user) throw new Error("User not authenticated");

      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskRef, updates);
    },
    [user]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await deleteDoc(taskRef);
    },
    [user]
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const task = tasks.find((t) => t.id === id);
      if (task) {
        const taskRef = doc(db, "users", user.uid, "tasks", id);
        await updateDoc(taskRef, { completed: !task.completed });
      }
    },
    [user, tasks]
  );

  // ... manter funções getFilteredTasks e counts existentes
  
  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getFilteredTasks,
    counts,
  };
}
```

### 5. Componente de Login (`src/components/auth/login-button.tsx`)

```typescript
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function LoginButton() {
  const { signInWithGitHub, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      // Erro já tratado no context
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
```

### 6. Menu do Usuário (`src/components/auth/user-menu.tsx`)

```typescript
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

export function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" variant="ghost">
          <img
            alt={user.displayName ?? "Avatar"}
            className="h-8 w-8 rounded-full"
            src={user.photoURL ?? "/placeholder-avatar.png"}
          />
          <span className="hidden md:inline">{user.displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5">
          <p className="font-medium text-sm">{user.displayName}</p>
          <p className="text-muted-foreground text-xs">@{user.username}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 7. Auth Guard (`src/components/auth/auth-guard.tsx`)

```typescript
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
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-foreground">TaskMaster</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie suas tarefas de forma simples e eficiente
          </p>
        </div>
        <LoginButton />
      </div>
    );
  }

  return <>{children}</>;
}
```

### 8. Modificar App Principal (`src/app.tsx`)

```typescript
import { AuthProvider } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ThemeProvider } from "@/components/theme-provider";

// ... TaskApp existente

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="taskmaster-theme">
      <AuthProvider>
        <AuthGuard>
          <TaskApp />
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 9. Modificar Sidebar (`src/components/layout/sidebar.tsx`)

**Substituir a seção do footer (usuário placeholder) por:**

```typescript
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/contexts/auth-context";

// Na função Sidebar, adicionar:
const { user } = useAuth();

// Substituir o footer existente por:
<div className="border-sidebar-border border-t p-3 md:p-4">
  <div className="flex flex-col-reverse items-center gap-3 md:flex-row md:justify-between">
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          alt={user?.displayName ?? "Avatar"}
          className="h-9 w-9 rounded-full object-cover"
          src={user?.photoURL ?? "/placeholder-avatar.png"}
        />
        <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-sidebar bg-foam" />
      </div>
      <div className="hidden md:block">
        <div className="font-medium text-sidebar-foreground text-sm">
          {user?.displayName ?? "Usuário"}
        </div>
        <div className="text-muted-foreground text-xs">
          @{user?.username ?? ""}
        </div>
      </div>
    </div>
    <ModeToggle />
  </div>
</div>
```

---

## 🔒 Regras de Segurança Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para tasks do usuário
    match /users/{userId}/tasks/{taskId} {
      // Apenas o próprio usuário pode ler/escrever suas tasks
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // Bloquear qualquer outro acesso
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🌐 Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Adicionar ao `.gitignore`:

```gitignore
.env.local
.env.*.local
```

---

## 🔄 Configuração do Firebase Console

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Criar novo projeto ou usar existente
3. Ativar Authentication e Firestore

### 2. Configurar GitHub OAuth

1. Firebase Console → Authentication → Sign-in method
2. Habilitar GitHub
3. Copiar callback URL do Firebase
4. No GitHub (Settings → Developer Settings → OAuth Apps):
   - Criar nova OAuth App
   - Colar callback URL
   - Copiar Client ID e Client Secret
5. Voltar ao Firebase e colar as credenciais

### 3. Configurar Firestore

1. Firebase Console → Firestore Database
2. Criar banco de dados em modo produção
3. Aplicar as regras de segurança acima

---

## 📝 Checklist de Implementação

- [ ] Instalar dependência `firebase`
- [ ] Criar arquivo `src/lib/firebase.ts`
- [ ] Criar arquivo `src/types/user.ts`
- [ ] Criar diretório `src/contexts/`
- [ ] Criar arquivo `src/contexts/auth-context.tsx`
- [ ] Criar diretório `src/components/auth/`
- [ ] Criar arquivo `src/components/auth/login-button.tsx`
- [ ] Criar arquivo `src/components/auth/user-menu.tsx`
- [ ] Criar arquivo `src/components/auth/auth-guard.tsx`
- [ ] Modificar `src/hooks/use-tasks.ts` para usar Firestore
- [ ] Modificar `src/app.tsx` para adicionar providers
- [ ] Modificar `src/components/layout/sidebar.tsx` para exibir dados do usuário
- [ ] Criar arquivo `.env.local` com variáveis do Firebase
- [ ] Atualizar `.gitignore`
- [ ] Configurar projeto no Firebase Console
- [ ] Configurar OAuth App no GitHub
- [ ] Aplicar regras de segurança no Firestore
- [ ] Testar fluxo completo de login/logout
- [ ] Verificar isolamento de dados entre usuários
- [ ] **Criar arquivo `docs/firebase-setup.md`** com tutorial detalhado de configuração do Firebase

---

## 📚 Documentação Final Obrigatória

> **IMPORTANTE**: Após concluir a implementação, o agente DEVE criar o arquivo `docs/firebase-setup.md` contendo um tutorial completo e detalhado com:

### Conteúdo Obrigatório do `docs/firebase-setup.md`

1. **Criação do Projeto Firebase**
   - Passo a passo com screenshots (descrições) de como criar um novo projeto
   - Configurações recomendadas (Analytics, etc.)

2. **Configuração do Firebase Authentication**
   - Como acessar a seção Authentication
   - Como habilitar o provedor GitHub
   - Onde encontrar e copiar a callback URL

3. **Configuração do GitHub OAuth App**
   - Como acessar GitHub Developer Settings (Settings → Developer Settings → OAuth Apps)
   - Passo a passo para criar uma nova OAuth App
   - Quais campos preencher:
     - **Application name**: Nome do app (ex: "TaskMaster")
     - **Homepage URL**: URL do app (ex: `http://localhost:5173` para dev ou URL de produção)
     - **Authorization callback URL**: URL copiada do Firebase Auth
   - Como copiar Client ID e Client Secret
   - **IMPORTANTE**: Explicar que o Client Secret só é exibido uma vez

4. **Vincular GitHub ao Firebase**
   - Onde colar as credenciais do GitHub no Firebase
   - Como salvar e ativar o provedor

5. **Configuração do Firestore Database**
   - Como criar o banco de dados
   - Escolha de localização/região
   - Modo de segurança inicial

6. **Regras de Segurança do Firestore**
   - Código completo das regras
   - Como acessar o editor de regras
   - Como aplicar e publicar as regras

7. **Obter Credenciais do Projeto Firebase**
   - Como acessar Project Settings → General → Your Apps
   - Como registrar um Web App no Firebase
   - Quais valores copiar do `firebaseConfig`:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`
   - Como criar o arquivo `.env.local` com as variáveis `VITE_FIREBASE_*`

8. **Configuração de Domínios Autorizados**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Adicionar `localhost` para desenvolvimento
   - Adicionar domínio de produção quando fizer deploy

9. **Verificação e Troubleshooting**
   - Como testar se está funcionando
   - Erros comuns e soluções:
     - "auth/popup-closed-by-user"
     - "auth/unauthorized-domain"
     - "permission-denied" no Firestore
     - Callback URL incorreta
   - Links úteis para documentação oficial:
     - [Firebase Auth Docs](https://firebase.google.com/docs/auth)
     - [GitHub OAuth Docs](https://docs.github.com/en/apps/oauth-apps)
     - [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Formato do Arquivo

- Usar Markdown com formatação clara
- Incluir blocos de código onde necessário
- Organizar em seções numeradas
- Incluir avisos e dicas importantes em destaque

---

## 🧪 Casos de Teste

| Cenário | Resultado Esperado |
|---------|-------------------|
| Acessar app sem login | Exibir tela de login com botão GitHub |
| Clicar em "Entrar com GitHub" | Abrir popup de autorização GitHub |
| Autorizar no GitHub | Redirecionar para app com usuário logado |
| Visualizar sidebar após login | Exibir foto, nome e @username do GitHub |
| Criar task logado | Task salva no Firestore sob `users/{uid}/tasks` |
| Fazer logout | Tasks não ficam visíveis |
| Login com outro usuário | Ver apenas tasks desse usuário |
| Tentar acessar tasks de outro uid | Bloqueado pelas regras do Firestore |

---

## ⚠️ Considerações Importantes

1. **Migração de Dados**: As tasks atuais estão em `localStorage`. Considerar migrar dados existentes para Firestore na primeira vez que o usuário logar.

2. **Tipo de `createdAt`**: `serverTimestamp()` retorna um `Timestamp` do Firestore. Ajustar `types/task.ts` para aceitar `Timestamp | string` ou converter no snapshot.

3. **Persistência do username**: Se o `localStorage` for limpo, o `@username` pode ficar vazio. Considere persistir o username no Firestore (ex: `users/{uid}/profile`).

4. **Modo Offline**: Firebase tem suporte offline. Habilitar com `enablePersistence()` se necessário.

5. **Rate Limiting**: Firestore tem limites de leitura/escrita. Monitorar uso no console.

6. **Custos**: O plano gratuito do Firebase tem limites generosos, mas monitorar uso em produção.

7. **Tratamento de Erros**: Implementar feedback visual para erros de rede/autenticação.
