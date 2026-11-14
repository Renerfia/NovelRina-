# NovelRina beta / portfolio checklist

Use this as a release checklist. Check an item only after verifying it in the running app or deployment; the repository review alone does not confirm runtime behavior.

## P0 — Make the main flows reliable

- [ ] Test sign-up, sign-in, session persistence after refresh, sign-out, and expired/invalid sessions.
- [ ] Test the complete user flow: create a novel, add/edit/delete chapters, generate and save a summary, then chat about that novel.
- [ ] Verify empty input, long chapter, model/API failure, network loss, and database failure all show useful UI feedback without losing existing content.
- [ ] Confirm the Groq and Google API keys are valid ASCII values, loaded from backend environment variables, and never exposed in frontend bundles or logs.
- [ ] Check that an AI timeout/failure returns a clear error and does not leave the UI stuck loading.

## P0 — Verify access control and secret handling

- [ ] Verify Supabase RLS is enabled on `novels` and `chapters`; test with two accounts that one user cannot read, change, or delete the other's rows.
- [ ] Verify policies use the authenticated user's ID and cover every operation the app performs, including updating chapter summaries.
- [ ] Verify the vector-search RPC checks ownership and cannot return another user's novel/chapter data; review its execution permissions.
- [ ] Confirm only Supabase's publishable/anon key is used in the frontend. Keep Supabase service-role and AI provider keys backend-only.
- [ ] Confirm `.env` files are ignored by Git; provide a safe `.env.example` containing variable names only.
- [ ] Remove or redact logs that print user queries, chapter text, user objects, access tokens, or provider error details.
- [ ] Restrict production CORS to the deployed frontend origin; do not rely on the frontend route guard as API/database authorization.

## P1 — Validate inputs and operational limits

- [ ] Set reasonable maximum lengths for chapter content, chat queries, and chat history on the backend.
- [ ] Add upload/request limits and rate limits for expensive AI endpoints to control abuse and unexpected provider costs.
- [ ] Validate chat history shape and bound how much history reaches the model.
- [ ] Return generic client-facing errors for internal/provider failures while keeping useful, redacted server-side tracebacks.
- [ ] Check startup configuration and fail clearly when required environment variables are missing.

## P1 — Prepare the repo for contributors and reviewers

- [ ] Replace the frontend template README with the actual product overview, features, architecture, setup, environment variables, and run commands.
- [ ] Fill in the backend README and update `backend/architecture.md`, which currently describes an older Streamlit app rather than the Vue/FastAPI application.
- [ ] Document Supabase schema expectations, RLS policy requirements, and vector-search RPC setup without including secrets.
- [ ] Add focused tests for auth guards, API validation/error handling, chapter ownership behavior, and summary/chat flows where they can be tested without live AI credentials.
- [ ] Run frontend type-check/build/lint and backend compile/tests; resolve failures and record the commands/results.
- [ ] Remove development-only tools/configuration from the production build where appropriate, and verify environment-specific frontend/backend URLs.

## P2 — Polish the beta experience

- [ ] Check responsive layouts and keyboard/accessibility behavior on login, novel/chapter management, editor, summary, and chat screens.
- [ ] Add clear empty, loading, success, and retry states; ensure toast messages are readable and do not replace persistent error details where needed.
- [ ] Confirm chapter edits and generated summaries remain consistent after navigation and page refresh.
- [ ] Add a live demo or short walkthrough with seeded, non-sensitive sample data; never publish real manuscripts or credentials.
- [ ] State known limitations and beta status on the project page/README.

## Release smoke test

- [ ] Deploy frontend and backend with production environment variables and HTTPS.
- [ ] Create a fresh test account and complete the main flow from sign-up through novel chat.
- [ ] Repeat key access-control checks against the deployed environment.
- [ ] Confirm logs contain no secrets or manuscript contents, and check that the app handles one failed AI request gracefully.
