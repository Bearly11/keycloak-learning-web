# Keycloak Learning Web

React and TypeScript frontend for the [Spring Boot backend](../../keycloak-learning/README.md). Keycloak hosts the sign-in screen; Spring Security handles the OIDC callback and keeps the browser session. React calls the backend with the same-origin session cookie and never receives or stores Keycloak tokens.

## Local development

1. Follow the backend [getting started guide](../keycloak-learning/docs/getting-started.md) to configure `.env`, start PostgreSQL and Keycloak, and configure the realm and clients.
2. Start the backend on port `9090`.
3. In this directory, install packages and run Vite:

   ```sh
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173` using `localhost` consistently. Vite proxies API, OAuth, callback, login, and logout requests to the backend so the session cookie stays on one origin.

The browser OIDC client needs the callback URI `http://localhost:5173/login/oauth2/code/keycloak-learning`. Its client secret stays in the backend `.env` as `KEYCLOAK_CLIENT_SECRET`. The frontend has no secrets or separate runtime environment file.

## Environment and secrets

The frontend does not need a `.env` file. Do not put credentials or API secrets in frontend environment variables: Vite bundles `VITE_*` values into client-side code, where users can inspect them. Keep Keycloak and database secrets in the backend's ignored `../keycloak-learning/.env` file. Frontend `.env*` files are ignored by Git; `.env.example` is allowed for non-secret setup examples.

## Screens and request flow

- `/` checks `/api/v1/auth/me`; signed-out users are redirected into Spring's `/oauth2/authorization/keycloak-learning` flow.
- `/register` posts account details to `/api/v1/auth/register`. Keycloak manages the password; the app stores only the profile and Keycloak user ID.
- After sign-in, the session page shows the current profile and example public, user, and admin API routes.
- State-changing API requests fetch `/api/v1/auth/csrf` and send the returned CSRF header. Logout posts to Spring Security's `/logout` endpoint.

## Project layout

- `src/app`: application startup and top-level page selection.
- `src/features/auth`: sign-in, registration, session screens, hook, and types.
- `src/components/layout`: shared application shell.
- `src/components/ui`: small reusable form and card components.
- `src/lib/api`: same-origin API client, CSRF handling, and logout.
- `src/index.css`: shared Tailwind theme tokens and application styles.

React Router is not installed; the app selects its small set of screens from the current path.

## Useful commands

```sh
npm run dev      # start the local Vite server
npm run build    # TypeScript project check and production build
npm run lint     # run ESLint
npm run preview  # preview the production build locally
```

See the [frontend structure notes](PROJECT_STRUCTURE.md) and the backend [Keycloak setup guide](../../keycloak-learning/docs/keycloak-ui-configuration.md) for more detail.
