# CLAUDE.md

Guidance for AI assistants (Claude Code and similar) working in this repository.

## Repository status

This repository (`cqtsca/AI-figures`) is currently **empty** — it has no
commits, no source files, and no remote branches beyond the default `main`.
The name suggests it will hold work related to AI-generated figures,
diagrams, or visualizations, but no code or specification exists yet.

When you make the first substantive change, **update this file** to
replace the placeholders below with real information (build commands,
entry points, layout, etc.). Until then, treat the sections below as
starting conventions rather than discovered facts.

## Working in this repo

### Branching

- Default branch: `main`.
- Feature work for Claude sessions on the web goes on the branch the
  harness assigns (e.g. `claude/<slug>`). Do **not** push directly to
  `main` without explicit permission.
- Create the assigned branch locally if it doesn't yet exist.

### Commits

- Write descriptive commit messages focused on the *why*, not just the
  *what*.
- Prefer small, focused commits over large omnibus changes.
- Never bypass hooks (`--no-verify`) or signing unless the user asks.

### Pushing

- Use `git push -u origin <branch-name>` on first push.
- Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on
  network failures only — never on validation failures.

### Pull requests

- Do **not** open a pull request unless the user explicitly asks.
- When asked, keep PR titles under ~70 characters and put detail in the
  body.

## Conventions to follow as code is added

Until the project picks a stack, default to these conservative
conventions and **document any deviations here**:

1. **Project metadata** — add a `README.md` describing what the project
   is and how to run it as soon as there is something to run.
2. **Dependencies** — pin direct dependencies; commit the lockfile.
3. **Formatting / linting** — wire up a formatter and linter early
   (`ruff`+`black` for Python, `prettier`+`eslint` for JS/TS) and run
   them in CI.
4. **Tests** — colocate tests with code or under a top-level `tests/`
   directory; record the test command in this file once chosen.
5. **Secrets** — never commit `.env`, credentials, or API keys. Add a
   `.gitignore` before adding any code.
6. **Generated artifacts** — if the project produces images, charts, or
   other binary figures, decide early whether they live in-repo
   (acceptable for small, version-controlled outputs) or in an external
   store (preferred for large or frequently regenerated files).

## Placeholders to fill in

Once the project takes shape, replace this section with concrete
information:

- **What the project does** — one-paragraph description.
- **Entry points** — main script, CLI command, or service to run.
- **Install** — exact commands (`uv sync`, `npm ci`, etc.).
- **Run** — how to start the app or generate figures locally.
- **Test** — exact test command and where tests live.
- **Lint / format** — exact commands.
- **Directory layout** — top-level folders and what lives in each.
- **External services** — any APIs, model providers, or data sources
  the project depends on, and how credentials are supplied.

## Notes for AI assistants

- **Don't invent structure.** If you're asked to add code and the layout
  isn't established, ask the user where it should live rather than
  guessing.
- **Don't create speculative scaffolding.** Add files only as they're
  needed for the current task. A bare repo doesn't need a `src/`,
  `tests/`, `docs/`, `.github/workflows/`, etc. until something
  populates them.
- **Keep this file current.** Whenever you add tooling, change the
  layout, or establish a convention, update the relevant section here in
  the same commit.
