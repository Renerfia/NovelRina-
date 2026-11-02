# NovelRina Architecture

This document describes the current project structure and how to extend it safely. Read it before adding a feature or changing data flows.

## 1. System overview

NovelRina is a Vue frontend and a Python backend layered over Supabase.

```text
Browser
  |
  | Authentication, novels, chapters, and direct data queries
  v
Vue/Vite frontend -> Supabase Auth -> Supabase PostgreSQL
  |
  | Optional/Future API use
  v
FastAPI backend -> Supabase/PostgreSQL
              -> Pydantic AI
              -> Google/Groq models
              -> Vector search (match_chapters RPC)
```

### Important current-state note

The frontend currently communicates with Supabase directly through composables. The FastAPI and AI code exists for backend capabilities, but several backend files/routers are not yet complete or integrated into the frontend.

## 2. Repository layout

```text
NovelRina/
├── frontend/
│   ├── src/
│   │   ├── assets/        # Global CSS, images, icons
│   │   ├── components/    # Reusable Vue UI components
│   │   ├── composables/   # Shared state and Supabase data operations
│   │   ├── lib/           # External clients, such as Supabase
│   │   ├── router/        # Routes and route guards
│   │   └── views/         # Page-level components
│   ├── package.json
│   └── architecture.md    # Frontend-specific styling documentation
└── backend/
    ├── agent/             # AI response, summary, and embedding agents
    ├── routers/           # FastAPI route definitions
    ├── tools/             # EPUB and text/chunk helper code
    ├── app.py             # Backend app entry point
    └── database.py        # Supabase and database operations
```

## 3. Frontend architecture

### Entry flow

1. `frontend/src/main.ts` creates the Vue application.
2. Global CSS is loaded.
3. Vue Router, Pinia, and PrimeVue are installed.
4. `App.vue` renders the active `<RouterView />`.
5. `router/index.ts` decides which page is accessible and applies authentication guards.

### Routes

| Route | View | Authentication |
| --- | --- | --- |
| `/` | `HomeView.vue` | Not required |
| `/novels` | `NovelsView.vue` | Required |
| `/novels/:id` | `NovelDetailsView.vue` | Required |

The router waits for the shared auth loading state before it redirects protected routes.

### Authentication

`src/composables/useAuth.ts` owns a module-level Supabase session state:

- `session`
- `user`
- `isLoggedIn`
- `loading`
- Sign-in, sign-up, and sign-out functions

`supabase.auth.onAuthStateChange(...)` updates this state for every authentication change. Components should use this composable instead of creating separate auth sources of truth.

### Data composables

`src/composables/` contains operations for a resource and its shared UI state.

| Composable | Responsibility |
| --- | --- |
| `useAuth.ts` | Session/authentication state and auth actions |
| `useNovels.ts` | Fetch/create/delete novels and shared novel state |
| `useChapter.ts` | Fetch/create/update/delete chapters and shared chapter state |

Rules:

- A composable may return `{ data, error }`, `{ success, error }`, or similar explicit results.
- The composable updates module-level Vue refs after successful mutations.
- Pages and components consume refs through Vue's template unwrapping.
- Database errors should be converted into user-readable strings rather than thrown only from components.
- Mutations must filter by ownership or natural parent IDs before updating data.

### Main data types

```ts
interface Novel {
  novel_id: string
  novel_name: string
  description?: string | null
}

interface Chapter {
  chapter_id: string
  chapter_name: string
  chapter_content: string
  novel_id: string
}
```

`chapter.novel_id` is the relationship to the parent novel. It must be included in parent-scoped update and delete operations.

### Frontend data flow

```text
Route /novels/:id
  -> NovelDetailsView reads the id route parameter
  -> useNovels.fetchNovel(novelId)
  -> useChapter.fetchChapters(novelId)
  -> ListChapterSideBar receives the chapters and emits the selected chapter
  -> NovelDetailsView stores selected_chapter
  -> SummarizationPanel receives selected_chapter
```

Loading, error, and null states belong inside the component that renders them when those states are local to that component. For child component props, use nullable or optional types and handle them with Vue `v-if`.

For example:

```vue
<ListChapterSideBar :chapters="chapters" :novel="novel" />
<SummarizationPanel :chapter="selected_chapter" />
```

The page should coordinate state, while child components decide how to render empty/loading/error values they receive.

### Chapter ownership rules

The chapter primary key alone is not enough for application-level authorization or ownership intent. Updates and deletes should use both the parent novel and chapter IDs:

```ts
await supabase
  .from('chapters')
  .update({ chapter_name, chapter_content })
  .eq('novel_id', novelId)
  .eq('chapter_id', chapterId)
```

```ts
await supabase
  .from('chapters')
  .delete()
  .eq('novel_id', novelId)
  .eq('chapter_id', chapterId)
  .select('chapter_id')
  .single()
```

Database Row Level Security should also enforce ownership. Frontend filters alone are not authorization.

### Component responsibilities

- `HomeView.vue`: Landing page content and login/register dialog state.
- `TopBar.vue`: Branding and authentication actions.
- `LoginDialog.vue` / `RegisterDialog.vue`: Email/password auth forms.
- `NovelsView.vue`: Library page; fetches and creates novels.
- `CreateNovel.vue`: Novel creation form.
- `NovelCard.vue`: One clickable novel card.
- `NovelDetailsView.vue`: Resolves route IDs, coordinates novel/chapter loading and chapter selection.
- `ListChapterSideBar.vue`: Displays/render-chapter list and emits `selected_chapter` with the full `Chapter` object.
- `SummarizationPanel.vue`: Displays selected chapter information or an empty state.

### Styling architecture

Global tokens and font variables live in:

- `frontend/src/assets/base.css`
- `frontend/src/assets/main.css`

The global UI font is Inter. Literata is used for headings and reading-style text. Components use scoped CSS and use shared CSS variables where possible.

Visual language:

- Gray glass surfaces for general library/home UI
- Dark warm brown/black surfaces for the novel-details screen
- Translucent borders, backdrop blur, soft shadows, and limited gradients
- Inter for controls and interface labels
- Literata for titles and reading content

For a new page, preserve this pattern: global tokens in `base.css`, page layout in the view, component-specific styles in the component, and reusable visual primitives as CSS variables rather than duplicated color constants.

## 4. Backend architecture

### Current Python modules

`database.py` contains Supabase initialization and database operations:

- Sign up/sign in/log out
- Fetch/create/delete novels
- Create/delete chapters
- Generate and store chapter embeddings
- Verify that a novel belongs to the current author
- Call the `match_chapters` vector-search RPC

`agent/agent.py` contains Pydantic AI agents:

- A response agent for novel questions
- A summary agent using an OpenAI-compatible Groq model
- Google embedding generation
- Novel-memory search through the vector database

`tools/chunk.py` splits text into chunks.

`tools/converter.py` extracts text from EPUB documents.

### Backend intended flow

```text
Client/API request
  -> FastAPI route
  -> Validate parent IDs and authenticated user
  -> Database operation in database.py
  -> Optional AI/embedding agent work
  -> Return structured JSON or HTTP error
```

### AI flows

#### Chapter embedding

```text
Chapter text
  -> Google embedding model
  -> 768-dimensional vector
  -> Insert into the chapters table
  -> Used later by match_chapters
```

#### Summary

```text
Chapter text
  -> summary agent
  -> Short summary, limited to 500 words
```

#### Novel chat

```text
User query + recent message history
  -> Response agent
  -> search_novel_memory tool
  -> Retrieve relevant chapters with novel_id filter
  -> Generate grounded response
```

## 5. Environment configuration

The frontend requires Vite variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Legacy key fallback is currently supported for:

```text
VITE_SUPABASE_PUBLIC_KEY
```

The backend loads Supabase settings through `database.py` using the environment:

```text
SUPABASE_URL
SUPABASE_PUBLIC_KEY
```

AI provider environment variables are also required by the selected Pydantic AI providers, such as Google/Groq credentials. Never expose service-role or private keys in frontend Vite variables.

## 6. Supabase data model

The application references at least these tables/RPC:

| Resource | Key fields |
| --- | --- |
| `novels` | `novel_id`, `novel_name`, `description`, `author_id` |
| `chapters` | `chapter_id`, `novel_id`, `chapter_name`, `chapter_content`, `chapter_content_embedding` |
| `match_chapters` RPC | Returns matching chapter content and similarity for a novel and embedding vector |

Actual constraints and SQL policies are controlled by the Supabase project. Before adding features, confirm or document:

- Primary and foreign keys
- Cascade behavior
- Author/owner relationships
- Row Level Security policies
- Indexes and vector index configuration
- RPC parameter types

## 7. Security boundaries

Frontend operations that read or mutate user data must satisfy both of these conditions:

1. Route/composable logic should only request the current user's rows.
2. Supabase Row Level Security must enforce the same ownership rules on the server.

Recommended boundaries:

- A user can read/create/update/delete only their own novels.
- A user can modify a chapter only if the chapter belongs to a novel owned by that user.
- Every chapter mutation must verify both IDs.
- Private AI APIs and provider secrets should remain on the backend.
- The frontend publishable key is public and is not proof of authorization.

## 8. Extension guide

### Add a frontend page

1. Add the view under `frontend/src/views/`.
2. Add a route in `frontend/src/router/index.ts`.
3. Add `requiresAuth` in route `meta` if the page needs authentication.
4. Add or reuse a composable under `frontend/src/composables/`.
5. Create reusable UI pieces under `frontend/src/components/`.
6. Use `v-if`/component-owned guards for nullable props and loading/error content.
7. Run `npm run type-check` and build before completion.

### Add a database resource

1. Define and migrate the Supabase table or RPC.
2. Add foreign-key and ownership columns.
3. Add/update Row Level Security policies.
4. Add a typed interface in the appropriate composable.
5. Implement list/create/update/delete operations in a composable.
6. Bind loading, error, and success states to the UI.
7. Verify cross-owner access is impossible.

### Add a chapter action

All action mutations should use:

```text
novel_id + chapter_id
```

This applies to update, delete, summarize, chat-context selection, export, and status changes. Do not use a chapter ID alone when a novel relationship is available.

### Add AI functionality

1. Keep provider secrets and privileged operations in the backend.
2. Put reusable AI code in `backend/agent/agent.py` or a dedicated agent module.
3. Add a typed request/response route in `backend/routers/`.
4. Scope vector searches with `novel_id`.
5. Handle provider failures, rate limits, empty embeddings, and timeouts explicitly.
6. Document the provider and required environment variables.

## 9. Development commands

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run type-check
npm run build
npm run test:unit
npm run lint
```

Backend:

```bash
cd backend
uv sync
uv run uvicorn app:app --reload
```

Before running the backend, set the required Supabase and AI-provider environment variables.

## 10. Recommended changes before major growth

- Complete the FastAPI route implementation and choose one backend-for-frontend boundary instead of mixing direct Supabase calls and API calls.
- Add backend authorisation middleware and consistent HTTP error responses.
- Add actual database migrations for all tables, indexes, constraints, and RLS policies.
- Add composable/service tests and router/auth tests.
- Replace `reloadWindow()` patterns with reactive auth state updates where possible.
- Add an actual chapter editor and full chapter route/view.
- Move the current plain summary display into a real AI summary request when its API is available.
- Add cancellation/loading guards for stale route changes and concurrent chapter/novel requests.
