# TaskMaster - To-Do App

> **Tier:** 2-Intermediate  
> **Stack:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui  
> **Theme:** Rosé Pine

---

## 📋 Descrição

Aplicação de gerenciamento de tarefas (To-Do) com design moderno e suporte a temas claro/escuro baseados no Rosé Pine (dark) e Rosé Pine Dawn (light).

---

## 🎨 Design & UI

### Design Reference (Figma)

| Viewport | Link |
|----------|------|
| **Desktop (1920px)** | <https://www.figma.com/design/DaRbMqDblM4KOVsE2KsmNK/Todo-App?node-id=1-672&m=dev> |
| **Mobile (390px)** | <https://www.figma.com/design/DaRbMqDblM4KOVsE2KsmNK/Todo-App?node-id=1-2039&m=dev> |

---

## 📱 Design Responsivo

### Breakpoints

| Breakpoint | Largura | Layout |
|------------|---------|--------|
| Mobile | `< 768px` | Sidebar colapsada (80px), apenas ícones |
| Desktop | `≥ 768px` | Sidebar expandida (256px), com labels |

### Layout Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (256px)  │        Main Content             │
│                   │                                 │
│  [✓] TaskMaster   │  Header: All Tasks (5 remaining)│
│                   │  [Filter] [Sort]                │
│  [+ New Task]     │                                 │
│                   │  ┌─────────────────────────┐    │
│  ☐ All Tasks (5)  │  │ Task Item               │    │
│  ☀ Today          │  └─────────────────────────┘    │
│  📅 Upcoming      │  ┌─────────────────────────┐    │
│  ✓ Completed      │  │ Task Item (editing)     │    │
│                   │  └─────────────────────────┘    │
│  TAGS             │  ┌─────────────────────────┐    │
│  ● Work           │  │ Task Item               │    │
│  ● Personal       │  └─────────────────────────┘    │
│  ● Projects       │                                 │
│                   │                                 │
│  [👤 User]        │                                 │
└─────────────────────────────────────────────────────┘
```

**Sidebar Desktop (256px)**

- Logo com texto "TaskMaster"
- Botão "New Task" com texto e ícone
- Links de navegação com ícone + label + contador
- Tags com círculo colorido + nome
- Perfil do usuário com avatar + nome + email

### Layout Mobile (< 768px)

```
┌───────────────────────────────────────┐
│ Aside │        Main Content           │
│ (80px)│                               │
│       │  Header: All Tasks            │
│ [✓]   │  5 remaining  [≡] [↕]         │
│       │                               │
│ [+]   │  ┌───────────────────────┐    │
│       │  │ Task Item             │    │
│ [☐]●  │  └───────────────────────┘    │
│ [☀]   │  ┌───────────────────────┐    │
│ [📅]  │  │ Task Item (editing)   │    │
│ [✓]   │  │ [📅] [🏷] [🚩]        │    │
│       │  │ [Cancel]  [Save]      │    │
│ ───   │  └───────────────────────┘    │
│  ●    │  ┌───────────────────────┐    │
│  ●    │  │ Task Item             │    │
│  ●    │  └───────────────────────┘    │
│       │                               │
│ [👤]  │                               │
└───────────────────────────────────────┘
```

**Sidebar Mobile (80px)**

- Apenas logo (ícone check em quadrado azul, 40x40px)
- Botão add (apenas ícone, 40x40px)
- Ícones de navegação centralizados (40x40px cada)
  - Link ativo: indicador visual (bolinha azul no canto)
- Divisor horizontal (32px de largura)
- Tags: apenas círculos coloridos (12x12px)
- Avatar do usuário (36x36px) com indicador online

**Tooltips no Mobile**

- Hover nos ícones mostra tooltip com o label
- Tooltip: `bg-overlay`, `text-text`, `rounded-md`
- Posição: à direita do ícone

### Diferenças Mobile vs Desktop

| Elemento | Desktop | Mobile |
|----------|---------|--------|
| Sidebar largura | 256px | 80px |
| Logo | Ícone + "TaskMaster" | Apenas ícone (40x40) |
| Botão New Task | Ícone + texto | Apenas ícone |
| Nav links | Ícone + label + badge | Apenas ícone |
| Tags | Círculo + nome | Apenas círculo |
| Perfil | Avatar + nome + email | Apenas avatar |
| Form edição botões | "Cancel" / "Save Changes" | "Cancel" / "Save" |
| Botões de ação | Ícone + texto | Apenas ícone (40x40) |

### Comportamento dos Botões de Ação (Mobile)

No modo de edição em mobile, os botões Due Date, Tag e Priority são exibidos apenas como ícones em botões quadrados:

```
┌────┐ ┌────┐ ┌────┐
│ 📅 │ │ 🏷 │ │ 🚩 │
└────┘ └────┘ └────┘
  40px   40px   40px
```

---

### Layout Principal

A aplicação possui um layout de duas colunas:

1. **Sidebar (256px de largura)**
   - Logo "TaskMaster" com ícone de check
   - Botão "New Task" (destaque azul)
   - Navegação principal:
     - All Tasks (com contador de tarefas pendentes)
     - Today
     - Upcoming
     - Completed
   - Seção de Tags com cores:
     - Work (`love` - rosa/vermelho)
     - Personal (`foam` - ciano/verde-água)
     - Projects (`iris` - roxo)
   - Perfil do usuário no rodapé

2. **Área Principal**
   - Header com título da seção e contador de tarefas
   - Botões de filtro e ordenação
   - Lista de tarefas com:
     - Checkbox para marcar como concluída
     - Título da tarefa
     - Data/horário (opcional)
     - Tag colorida (opcional)
   - Estado de edição inline com destaque visual (borda azul, sombra)

---

## 🛠️ Tech Stack

### Obrigatório

| Tecnologia | Documentação |
|------------|--------------|
| **React 18+** | Framework UI |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool |
| **Tailwind CSS v4** | <https://tailwindcss.com/> |
| **shadcn/ui** | <https://ui.shadcn.com/llms.txt> |
| **Rosé Pine Theme** | <https://github.com/rose-pine/tailwind-css> |

### Componentes shadcn/ui Recomendados

```bash
pnpm dlx shadcn@latest add button input checkbox card badge dropdown-menu tooltip
```

- `Button` - Botões de ação (New Task, Save, Cancel)
- `Input` - Campo de entrada de tarefas
- `Checkbox` - Marcar tarefas como concluídas
- `Card` - Container das tarefas
- `Badge` - Tags coloridas (Work, Personal, Projects)
- `DropdownMenu` - Menu de toggle de tema e seleção de prioridade/tag
- `Tooltip` - Tooltips no mobile para ícones da sidebar

---

## 🌙 Dark Mode (Vite)

> **Referência:** <https://ui.shadcn.com/docs/dark-mode/vite>

### 1. Criar ThemeProvider

Crie o arquivo `src/components/theme-provider.tsx`:

```tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
```

### 2. Envolver o App com ThemeProvider

```tsx
// src/App.tsx
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="taskmaster-theme">
      {/* ... resto do app */}
    </ThemeProvider>
  );
}

export default App;
```

### 3. Componente ModeToggle (Opcional)

```tsx
// src/components/mode-toggle.tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🎨 Theming (shadcn/ui + Rosé Pine)

> **Referência:** <https://ui.shadcn.com/docs/theming>

### Convenção de Cores

shadcn/ui usa a convenção `background` e `foreground`:

- `--background`: cor de fundo do componente
- `--foreground`: cor do texto

```html
<div class="bg-primary text-primary-foreground">Hello</div>
```

### Variáveis CSS Necessárias

Configure no seu arquivo CSS principal as variáveis do shadcn/ui mapeadas para o Rosé Pine:

```css
@import "tailwindcss";

/* Rosé Pine Theme para shadcn/ui */
/* Light: Rosé Pine Dawn | Dark: Rosé Pine */

:root {
  --radius: 0.75rem; /* 12px */
  
  /* Rosé Pine Dawn (tema claro) */
  --background: #faf4ed;
  --foreground: #575279;
  --card: #fffaf3;
  --card-foreground: #575279;
  --popover: #f2e9e1;
  --popover-foreground: #575279;
  --primary: #286983;
  --primary-foreground: #faf4ed;
  --secondary: #f2e9e1;
  --secondary-foreground: #575279;
  --muted: #f2e9e1;
  --muted-foreground: #797593;
  --accent: #f4ede8;
  --accent-foreground: #575279;
  --destructive: #b4637a;
  --border: #dfdad9;
  --input: #cecacd;
  --ring: #286983;

  /* Sidebar específico */
  --sidebar: #fffaf3;
  --sidebar-foreground: #575279;
  --sidebar-primary: #286983;
  --sidebar-primary-foreground: #faf4ed;
  --sidebar-accent: #f2e9e1;
  --sidebar-accent-foreground: #575279;
  --sidebar-border: #dfdad9;
  --sidebar-ring: #286983;
  
  /* Cores semânticas do Rosé Pine Dawn */
  --love: #b4637a;
  --gold: #ea9d34;
  --rose: #d7827e;
  --pine: #286983;
  --foam: #56949f;
  --iris: #907aa9;
  
  /* Highlight colors (light mode) */
  --highlight-low: #f4ede8;
  --highlight-med: #dfdad9;
  --highlight-high: #cecacd;
  
  --destructive-foreground: #faf4ed;
}

.dark {
  /* Rosé Pine (tema escuro) */
  --background: #191724;
  --foreground: #e0def4;
  --card: #1f1d2e;
  --card-foreground: #e0def4;
  --popover: #26233a;
  --popover-foreground: #e0def4;
  --primary: #31748f;
  --primary-foreground: #e0def4;
  --secondary: #26233a;
  --secondary-foreground: #e0def4;
  --muted: #26233a;
  --muted-foreground: #908caa;
  --accent: #403d52;
  --accent-foreground: #e0def4;
  --destructive: #eb6f92;
  --border: #21202e;
  --input: #403d52;
  --ring: #31748f;

  /* Sidebar específico */
  --sidebar: #1f1d2e;
  --sidebar-foreground: #e0def4;
  --sidebar-primary: #31748f;
  --sidebar-primary-foreground: #e0def4;
  --sidebar-accent: #26233a;
  --sidebar-accent-foreground: #e0def4;
  --sidebar-border: #21202e;
  --sidebar-ring: #31748f;
  
  /* Cores semânticas do Rosé Pine */
  --love: #eb6f92;
  --gold: #f6c177;
  --rose: #ebbcba;
  --pine: #31748f;
  --foam: #9ccfd8;
  --iris: #c4a7e7;
  
  /* Highlight colors (dark mode) */
  --highlight-low: #21202e;
  --highlight-med: #403d52;
  --highlight-high: #524f67;
  
  --destructive-foreground: #e0def4;
}

/* Disponibilizar variáveis para Tailwind */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius: var(--radius);
  
  /* Cores semânticas do Rosé Pine (usa variáveis CSS para suportar light/dark) */
  --color-love: var(--love);
  --color-gold: var(--gold);
  --color-rose: var(--rose);
  --color-pine: var(--pine);
  --color-foam: var(--foam);
  --color-iris: var(--iris);
  
  /* Highlight colors (usa variáveis CSS para suportar light/dark) */
  --color-highlight-low: var(--highlight-low);
  --color-highlight-med: var(--highlight-med);
  --color-highlight-high: var(--highlight-high);
  
  --color-destructive-foreground: var(--destructive-foreground);
}
```

---

## 🎨 Tema Rosé Pine

### Instalação (Tailwind CSS v4)

> ⚠️ **Não há pacote npm disponível.** Copie os arquivos diretamente do repositório.

**Repositório:** <https://github.com/rose-pine/tailwind-css>

**Passos:**

1. Copie a pasta `rose-pine-tailwind-v4` do repositório para sua pasta de estilos (ex: `src/styles/`)
2. Importe o tema no seu arquivo CSS principal:

```css
@import "tailwindcss";

@import "./rose-pine-tailwind-v4/rose-pine.css";      /* Tema escuro */
@import "./rose-pine-tailwind-v4/rose-pine-dawn.css"; /* Tema claro */
```

1. Use as cores com o prefixo `rose-pine-`:

```html
<div class="bg-rose-pine-base text-rose-pine-gold">
  Pretty nice
</div>
```

### Alternativa: Configuração Manual

Se preferir não copiar os arquivos, adicione as cores manualmente no seu CSS:

```css
@import "tailwindcss";

@theme {
  /* Rosé Pine (Dark) */
  --color-base: #191724;
  --color-surface: #1f1d2e;
  --color-overlay: #26233a;
  --color-muted: #6e6a86;
  --color-subtle: #908caa;
  --color-text: #e0def4;
  --color-love: #eb6f92;
  --color-gold: #f6c177;
  --color-rose: #ebbcba;
  --color-pine: #31748f;
  --color-foam: #9ccfd8;
  --color-iris: #c4a7e7;
  --color-highlight-low: #21202e;
  --color-highlight-med: #403d52;
  --color-highlight-high: #524f67;
}
```

### Paleta de Cores - Rosé Pine (Tema Escuro)

| Variável | Cor | Uso |
|----------|-----|-----|
| `base` | `#191724` | Background principal |
| `surface` | `#1f1d2e` | Cards, sidebar |
| `overlay` | `#26233a` | Overlays, modais, cards em destaque |
| `muted` | `#6e6a86` | Texto desabilitado, placeholders |
| `subtle` | `#908caa` | Bordas, ícones inativos |
| `text` | `#e0def4` | Texto principal |
| `love` | `#eb6f92` | Tag Work, erros, ações destrutivas |
| `gold` | `#f6c177` | Avisos, prioridade alta |
| `rose` | `#ebbcba` | Destaques, links hover |
| `pine` | `#31748f` | Botões primários, accent principal |
| `foam` | `#9ccfd8` | Tag Personal, sucesso |
| `iris` | `#c4a7e7` | Tag Projects, informação |
| `highlightLow` | `#21202e` | Hover states |
| `highlightMed` | `#403d52` | Seleção, estado ativo |
| `highlightHigh` | `#524f67` | Focus states, bordas ativas |

### Paleta de Cores - Rosé Pine Dawn (Tema Claro)

| Variável | Cor | Uso |
|----------|-----|-----|
| `base` | `#faf4ed` | Background principal |
| `surface` | `#fffaf3` | Cards, sidebar |
| `overlay` | `#f2e9e1` | Overlays, modais, cards em destaque |
| `muted` | `#9893a5` | Texto desabilitado, placeholders |
| `subtle` | `#797593` | Bordas, ícones inativos |
| `text` | `#575279` | Texto principal |
| `love` | `#b4637a` | Tag Work, erros, ações destrutivas |
| `gold` | `#ea9d34` | Avisos, prioridade alta |
| `rose` | `#d7827e` | Destaques, links hover |
| `pine` | `#286983` | Botões primários, accent principal |
| `foam` | `#56949f` | Tag Personal, sucesso |
| `iris` | `#907aa9` | Tag Projects, informação |
| `highlightLow` | `#f4ede8` | Hover states |
| `highlightMed` | `#dfdad9` | Seleção, estado ativo |
| `highlightHigh` | `#cecacd` | Focus states, bordas ativas |

### Mapeamento de Uso das Cores

| Elemento UI | Cor Rosé Pine |
|-------------|---------------|
| Background da aplicação | `base` |
| Sidebar background | `surface` |
| Card de tarefa | `surface` |
| Card em edição/modal | `overlay` |
| Bordas | `highlightLow` |
| Texto principal | `text` |
| Texto secundário | `subtle` |
| Texto terciário/muted | `muted` |
| Botão primário | `pine` |
| Botão primário hover | `pine` com opacity |
| Focus ring/outline | `pine` |
| Tag Work | `love` (bg: `love/20`) |
| Tag Personal | `foam` (bg: `foam/20`) |
| Tag Projects | `iris` (bg: `iris/20`) |
| Link ativo na sidebar | `pine` (bg: `pine/10`) |
| Contador/badge | `pine` (bg: `pine/20`) |

---

## 📐 Estrutura de Componentes

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── tooltip.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx        # Navegação lateral
│   │   ├── Header.tsx         # Cabeçalho da área principal
│   │   └── MainLayout.tsx     # Layout wrapper
│   ├── tasks/
│   │   ├── TaskList.tsx       # Lista de tarefas
│   │   ├── TaskItem.tsx       # Item individual de tarefa
│   │   ├── TaskForm.tsx       # Formulário de criação/edição
│   │   └── TaskFilters.tsx    # Botões de filtro/ordenação
│   ├── tags/
│   │   └── TagBadge.tsx       # Badge de tag colorida
│   ├── theme-provider.tsx     # Contexto de tema (light/dark)
│   └── mode-toggle.tsx        # Toggle de tema
├── hooks/
│   ├── useTasks.ts            # Hook de gerenciamento de tarefas
│   └── useLocalStorage.ts     # Hook para persistência
├── types/
│   └── task.ts                # Tipos TypeScript
├── lib/
│   └── utils.ts               # Utilitários (cn function)
└── App.tsx
```

---

## 📝 Tipos TypeScript

```typescript
type TagType = "work" | "personal" | "projects";

type PriorityType = "low" | "medium" | "high";

type FilterType = "all" | "today" | "upcoming" | "completed";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  tag?: TagType;
  priority?: PriorityType;
}

interface TasksState {
  tasks: Task[];
  filter: FilterType;
  editingTaskId: string | null;
}
```

---

## ✅ User Stories

### Funcionalidades Básicas

- [ ] Usuário pode ver um campo de `input` para digitar uma tarefa
- [ ] Ao pressionar Enter (ou botão), a tarefa é adicionada à lista
- [ ] Usuário pode marcar uma tarefa como `completed` via checkbox
- [ ] Usuário pode remover uma tarefa

### Funcionalidades Bônus

- [ ] Usuário pode editar uma tarefa (modo inline com destaque visual)
- [ ] Usuário pode filtrar tarefas por status (All, Today, Upcoming, Completed)
- [ ] Usuário pode ver a data de criação da tarefa
- [ ] Usuário pode atribuir tags às tarefas (Work, Personal, Projects)
- [ ] Usuário pode definir uma data de vencimento (Due Date)
- [ ] Usuário pode definir prioridade (Low, Medium, High)
- [ ] Usuário pode alternar entre tema claro e escuro
- [ ] Dados são persistidos no `localStorage`

---

## 🎯 Comportamentos de UI

### Estado Normal da Tarefa

- Background: `surface`
- Borda: `highlightLow` (1px)
- Border radius: `12px`
- Padding: `16px`
- Opacidade quando em modo de edição de outra tarefa: `0.4`

### Estado de Edição da Tarefa

- Background: `overlay`
- Borda: `pine/30` com sombra
- Ring/Outline: `pine/50`
- Input com focus ring `pine`
- Botões de ação: Due Date, Tag, Priority
- Botões de confirmação: Cancel (ghost), Save Changes (primary com `pine`)

### Cores de Prioridade

| Prioridade | Cor Rosé Pine | Uso |
|------------|---------------|-----|
| Low | `foam` | Prioridade baixa |
| Medium | `gold` | Prioridade média |
| High | `love` | Prioridade alta |

### Sidebar

- Background: `surface`
- Opacidade padrão: `0.6`
- Opacidade no hover: `1.0`
- Link ativo: background `pine/10`, texto `pine`
- Tags: círculos coloridos (`love`, `foam`, `iris`)

---

## 🔗 Recursos Úteis

- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Rosé Pine Palette](https://rosepinetheme.com/palette)
- [Lucide Icons](https://lucide.dev/) (usado pelo shadcn/ui)
- [Material Icons](https://fonts.google.com/icons) (usado no Figma)

---

## 🚀 Setup Inicial

```bash
# 1. Instalar dependências
pnpm install

# 2. Adicionar shadcn/ui (selecione cssVariables: true)
pnpm dlx shadcn@latest init

# 3. Adicionar componentes necessários
pnpm dlx shadcn@latest add button input checkbox card badge dropdown-menu tooltip

# 4. Copiar tema Rosé Pine (opcional - se quiser usar cores separadas)
# Baixe a pasta rose-pine-tailwind-v4 de:
# https://github.com/rose-pine/tailwind-css
# E copie para src/styles/

# 5. Configurar CSS com variáveis do shadcn + Rosé Pine
# Ver seção "Theming (shadcn/ui + Rosé Pine)" acima

# 6. Criar ThemeProvider
# Ver seção "Dark Mode (Vite)" acima

# 7. Rodar em desenvolvimento
pnpm dev
```

### Estrutura de Arquivos CSS

```
src/
├── index.css              # Variáveis CSS (shadcn + Rosé Pine)
├── App.css                # Estilos específicos do app
└── styles/
    └── rose-pine-tailwind-v4/  # (opcional) cores extras do Rosé Pine
        ├── rose-pine.css       # Tema escuro
        └── rose-pine-dawn.css  # Tema claro
```

---

## 📁 Figma Node Reference

| Elemento | Node ID |
|----------|---------|
| **Desktop (1920w dark)** | `node-id=1:672` |
| **Mobile (390w dark)** | `node-id=1:2039` |
| **Componentes de navegação** | Ver estrutura no Figma |
| **Estados de componentes** | Incluem variantes hover, selected, editing |
