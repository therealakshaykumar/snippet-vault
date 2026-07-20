# Snippet Pool

A JS/TS snippet manager. Paste code, run it in a sandboxed iframe, save it to
Firestore. Public snippets are viewable by anyone; creating, editing, and
deleting requires signing in.

## Stack

- Next.js 16 (App Router)
- Firebase Auth (Google + Email/Password)
- Firestore (snippet storage)
- Monaco Editor + Fira Code
- Client-side sandboxed iframe for running JS/TS (Babel standalone transpiles TS)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a Firebase project at https://console.firebase.google.com
   - Enable **Authentication** → Sign-in method → turn on **Google** and
     **Email/Password**
   - Enable **Firestore Database** → start in production mode (the rules
     file below handles access control)
   - Go to Project Settings → General → Your apps → add a Web app, copy the
     config values

3. Copy the env example and fill in your Firebase config:
   ```
   cp .env.local.example .env.local
   ```

4. Deploy the Firestore security rules (or paste `firestore.rules` into the
   Firebase Console → Firestore → Rules tab):
   ```
   firebase deploy --only firestore:rules
   ```
   (requires the Firebase CLI: `npm install -g firebase-tools`, then
   `firebase init firestore` in this directory to link your project)

5. Run the dev server:
   ```
   npm run dev
   ```

## How code execution works

Since this only needs to support JS/TS, there's no backend execution service.
Instead, `RunPanel` creates a `sandbox="allow-scripts"` iframe (deliberately
**without** `allow-same-origin`, so the sandboxed code cannot reach your app's
cookies, storage, or DOM). Your code runs inside that iframe via `Function()`,
`console.*` calls are captured and relayed back to the parent via
`postMessage`, and a 3-second timeout guards against infinite loops. For
TypeScript, the code is transpiled client-side with `@babel/standalone`
before being sent to the iframe.

## Project structure

```
app/
  page.tsx                    Public snippet feed
  snippets/[id]/page.tsx      View + run a snippet
  dashboard/page.tsx          Your own snippets (protected)
  dashboard/new/page.tsx      Create a snippet (protected)
  dashboard/[id]/edit/page.tsx  Edit a snippet (protected)
components/
  CodeEditor.tsx              Monaco wrapper, Fira Code themed
  RunPanel.tsx                Sandboxed run + terminal-style output
  SnippetForm.tsx             Shared create/edit form
  SnippetCard.tsx             List item
  NavBar.tsx / SignInModal.tsx / ProtectedRoute.tsx
lib/
  firebase.ts                 Firebase init
  auth-context.tsx            Auth provider + useAuth hook
  firestore.ts                Snippet CRUD functions
  hooks/useSnippets.ts        Data-fetching hooks
firestore.rules               Security rules (paste into Firebase Console)
```

## Notes

- Firestore rules are the real gate on write access — enforce them, don't
  rely on the UI alone.
- `isPublic` defaults to `false` on new snippets — nothing is shared by
  accident.
