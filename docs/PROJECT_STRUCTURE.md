# Frontend project structure

This frontend uses a small feature-based structure. Application startup lives in `src/app`, feature-specific code stays together under `src/features`, and only code shared by multiple parts of the app belongs in the shared folders.

```text
src/
├── app/
│   ├── App.tsx
│   └── main.tsx
├── components/
│   ├── layout/
│   │   └── AppShell.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── features/
│   └── auth/
│       ├── hooks/
│       │   └── useSession.ts
│       ├── pages/
│       │   ├── RegisterPage.tsx
│       │   ├── SessionPage.tsx
│       │   └── SignInPage.tsx
│       └── types.ts
├── lib/
│   └── api/
│       └── client.ts
├── assets/
└── index.css
```

## What belongs where

- **`app/`** starts the React app and chooses which top-level view to show. Add route configuration here if the app adopts a routing library.
- **`features/auth/`** holds sign-in, registration, and session views, session-specific hooks, and authentication types. The sign-in page starts Spring Security's Keycloak OIDC flow; the browser uses the backend session cookie. The registration page submits to the backend registration API.
- **`features/users/`** is intentionally not created yet. Add it when the app has user-focused behavior such as a user list or profile editing. Account creation is currently part of the authentication flow.
- **`components/layout/`** contains shared page structure such as the app header and footer.
- **`components/ui/`** contains reusable shadcn/ui components such as buttons, cards, and inputs. Add more shared interface pieces here as the app needs them.
- **`lib/`** contains shared helpers. `lib/api/` has the API request and Spring CSRF handling; `lib/utils.ts` has `cn()`, which combines CSS class names and resolves conflicting Tailwind classes.
- **`hooks/` and `types/` at the source root** should be added only when a hook or type is shared across multiple features. Keep auth-only code within `features/auth/`.
- **`assets/` and `index.css`** contain imported visual assets and app-wide styles.
- **`docs/PROJECT_STRUCTURE.md`** describes these boundaries so future files have a predictable home.

React Router is not installed. The app uses `/` for sign-in, `/register` for account creation, and displays the session page for authenticated users.
