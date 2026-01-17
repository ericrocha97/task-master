# Configuracao do Firebase para TaskMaster

Este guia detalha como configurar o Firebase Authentication (GitHub OAuth) e Firestore para o TaskMaster.

---

## Sumario

- [Configuracao do Firebase para TaskMaster](#configuracao-do-firebase-para-taskmaster)
  - [Sumario](#sumario)
  - [1. Criar Projeto Firebase](#1-criar-projeto-firebase)
  - [2. Configurar Firebase Authentication](#2-configurar-firebase-authentication)
  - [3. Criar OAuth App no GitHub](#3-criar-oauth-app-no-github)
  - [4. Vincular GitHub ao Firebase](#4-vincular-github-ao-firebase)
  - [5. Configurar Firestore Database](#5-configurar-firestore-database)
  - [6. Aplicar Regras de Seguranca](#6-aplicar-regras-de-seguranca)
  - [7. Obter Credenciais do Projeto](#7-obter-credenciais-do-projeto)
  - [8. Configurar Variaveis de Ambiente](#8-configurar-variaveis-de-ambiente)
  - [9. Configurar Dominios Autorizados](#9-configurar-dominios-autorizados)
  - [10. Verificacao e Troubleshooting](#10-verificacao-e-troubleshooting)
    - [Testando o Login](#testando-o-login)
    - [Erros Comuns e Solucoes](#erros-comuns-e-solucoes)
      - [`auth/popup-closed-by-user`](#authpopup-closed-by-user)
      - [`auth/unauthorized-domain`](#authunauthorized-domain)
      - [`auth/account-exists-with-different-credential`](#authaccount-exists-with-different-credential)
      - [`permission-denied` no Firestore](#permission-denied-no-firestore)
      - [Callback URL Incorreta](#callback-url-incorreta)
      - [Login funciona mas tasks nao salvam](#login-funciona-mas-tasks-nao-salvam)
    - [Depuracao](#depuracao)
  - [Links Uteis](#links-uteis)
  - [Checklist Final](#checklist-final)

---

## 1. Criar Projeto Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)

2. Clique em **"Adicionar projeto"** (ou "Add project")

3. Digite um nome para o projeto (ex: `taskmaster-app`)

4. **Google Analytics** (opcional):
   - Pode desabilitar se nao precisar de analytics
   - Se habilitar, selecione ou crie uma conta do Google Analytics

5. Clique em **"Criar projeto"** e aguarde a criacao

6. Apos criado, clique em **"Continuar"** para acessar o console do projeto

---

## 2. Configurar Firebase Authentication

1. No menu lateral do Firebase Console, clique em **"Authentication"**

2. Clique em **"Comecar"** (ou "Get started")

3. Na aba **"Sign-in method"**, voce vera uma lista de provedores

4. Localize **"GitHub"** na lista e clique nele

5. Ative o toggle **"Habilitar"**

6. Voce vera dois campos:
   - **Client ID**: deixe vazio por enquanto
   - **Client secret**: deixe vazio por enquanto

7. **IMPORTANTE**: Copie a **URL de callback de autorizacao** exibida
   - Formato: `https://YOUR_PROJECT.firebaseapp.com/__/auth/handler`
   - Guarde esta URL, voce vai precisar no proximo passo

8. **NAO clique em Salvar ainda** - primeiro precisamos criar o OAuth App no GitHub

---

## 3. Criar OAuth App no GitHub

1. Acesse o GitHub e va em **Settings** (clique no seu avatar > Settings)

2. No menu lateral, role ate **"Developer settings"** (no final)

3. Clique em **"OAuth Apps"**

4. Clique em **"New OAuth App"**

5. Preencha os campos:

   | Campo                          | Valor                                                            |
   | ------------------------------ | ---------------------------------------------------------------- |
   | **Application name**           | `TaskMaster` (ou o nome que preferir)                            |
   | **Homepage URL**               | `http://localhost:5173` (desenvolvimento) ou sua URL de producao |
   | **Application description**    | (opcional) Descricao do app                                      |
   | **Authorization callback URL** | Cole a URL copiada do Firebase (passo 2.7)                       |

6. Clique em **"Register application"**

7. Na pagina seguinte, voce vera:
   - **Client ID**: Copie este valor
   - **Client secrets**: Clique em **"Generate a new client secret"**

8. **ATENCAO**: O Client Secret so e exibido **UMA VEZ**. Copie e guarde em local seguro!

---

## 4. Vincular GitHub ao Firebase

1. Volte ao Firebase Console > Authentication > Sign-in method > GitHub

2. Cole as credenciais do GitHub:
   - **Client ID**: Cole o Client ID copiado do GitHub
   - **Client secret**: Cole o Client Secret copiado do GitHub

3. Clique em **"Salvar"**

4. O provedor GitHub agora deve aparecer como **"Ativado"** na lista

---

## 5. Configurar Firestore Database

1. No menu lateral do Firebase Console, clique em **"Firestore Database"**

2. Clique em **"Criar banco de dados"** (ou "Create database")

3. Escolha o modo inicial:
   - Selecione **"Iniciar no modo de producao"** (Start in production mode)
   - Isso garante que as regras de seguranca estejam ativas desde o inicio

4. Escolha a **localizacao do servidor**:
   - Recomendado para Brasil: `southamerica-east1` (Sao Paulo)
   - Ou escolha a regiao mais proxima dos seus usuarios

5. Clique em **"Criar"** (ou "Create")

6. Aguarde a criacao do banco de dados

---

## 6. Aplicar Regras de Seguranca

1. No Firestore Database, clique na aba **"Regras"** (ou "Rules")

2. Substitua o conteudo existente pelas regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para tasks do usuario
    match /users/{userId}/tasks/{taskId} {
      // Apenas o proprio usuario pode ler/escrever suas tasks
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

1. Clique em **"Publicar"** (ou "Publish")

2. Aguarde a confirmacao de que as regras foram aplicadas

**O que essas regras fazem:**

- Usuarios autenticados so podem acessar suas proprias tasks
- O caminho `users/{uid}/tasks` garante isolamento por usuario
- Qualquer outro caminho e bloqueado por padrao

---

## 7. Obter Credenciais do Projeto

1. No Firebase Console, clique no icone de **engrenagem** (ao lado de "Visao geral do projeto")

2. Selecione **"Configuracoes do projeto"** (Project settings)

3. Role ate a secao **"Seus apps"** (Your apps)

4. Se nao houver um Web App, clique no icone **"</>"** (Web) para adicionar

5. Preencha:
   - **Apelido do app**: `TaskMaster Web`
   - **Firebase Hosting**: deixe desmarcado (opcional)

6. Clique em **"Registrar app"**

7. Voce vera o objeto `firebaseConfig` com as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

1. Copie cada valor para usar no proximo passo

---

## 8. Configurar Variaveis de Ambiente

1. Na raiz do projeto, copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

1. Edite o arquivo `.env.local` com suas credenciais:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

1. **IMPORTANTE**: O arquivo `.env.local` ja esta no `.gitignore` e NAO deve ser commitado

2. Reinicie o servidor de desenvolvimento:

```bash
pnpm dev
```

---

## 9. Configurar Dominios Autorizados

Para que o login funcione, o dominio precisa estar autorizado no Firebase.

1. Firebase Console > Authentication > Settings (aba "Configuracoes")

2. Role ate **"Dominios autorizados"** (Authorized domains)

3. Verifique se os seguintes dominios estao na lista:
   - `localhost` (para desenvolvimento)
   - `seu-projeto.firebaseapp.com`

4. Para producao, clique em **"Adicionar dominio"** e adicione:
   - Seu dominio de producao (ex: `taskmaster.seudominio.com`)

---

## 10. Verificacao e Troubleshooting

### Testando o Login

1. Inicie o servidor de desenvolvimento: `pnpm dev`
2. Acesse `http://localhost:5173`
3. Clique em "Entrar com GitHub"
4. Autorize o app no popup do GitHub
5. Voce deve ser redirecionado para o app com seu usuario logado

### Erros Comuns e Solucoes

#### `auth/popup-closed-by-user`

- **Causa**: Usuario fechou o popup antes de completar o login
- **Solucao**: Tente novamente e complete o fluxo de autorizacao

#### `auth/unauthorized-domain`

- **Causa**: O dominio nao esta autorizado no Firebase
- **Solucao**: Adicione o dominio em Authentication > Settings > Authorized domains

#### `auth/account-exists-with-different-credential`

- **Causa**: Email ja esta vinculado a outro metodo de login
- **Solucao**: Use o metodo de login original ou vincule as contas

#### `permission-denied` no Firestore

- **Causa**: Regras de seguranca bloqueando acesso
- **Solucao**:
  1. Verifique se o usuario esta autenticado
  2. Confirme que as regras estao corretas
  3. Verifique se o caminho da colecao esta correto (`users/{uid}/tasks`)

#### Callback URL Incorreta

- **Causa**: URL de callback no GitHub nao corresponde ao Firebase
- **Solucao**:
  1. Copie a URL exata do Firebase (Authentication > GitHub > Callback URL)
  2. Atualize no GitHub Developer Settings > OAuth Apps > Seu App

#### Login funciona mas tasks nao salvam

- **Causa**: Firestore pode nao estar configurado corretamente
- **Solucao**:
  1. Verifique se o Firestore foi criado
  2. Confirme que as regras de seguranca foram publicadas
  3. Verifique o console do navegador para erros detalhados

### Depuracao

Para debugar problemas de autenticacao, abra o console do navegador (F12) e observe:

- Erros de rede na aba Network
- Erros de JavaScript na aba Console
- Detalhes de requisicoes do Firebase

---

## Links Uteis

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
- [GitHub Developer Settings](https://github.com/settings/developers)

---

## Checklist Final

- [x] Projeto Firebase criado
- [x] Authentication habilitado com provedor GitHub
- [x] OAuth App criado no GitHub
- [x] Client ID e Secret configurados no Firebase
- [x] Firestore Database criado
- [x] Regras de seguranca aplicadas
- [x] Web App registrado no Firebase
- [x] Arquivo `.env.local` criado com credenciais
- [x] Dominios autorizados configurados
- [x] Teste de login realizado com sucesso
- [x] Teste de criacao de task realizado com sucesso
