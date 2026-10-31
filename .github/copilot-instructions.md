# Copilot instructions

Project context Copilot should apply to every session in this repository.

## Stack

- Framework: Astro (static output).
- Language: TypeScript.
- Styling: plain CSS in the base layout.

## Conventions

- Keep components small and focused.
- Prefer semantic HTML and accessible markup.
- Do not close, or add closing keywords for, the exercise walkthrough issue (issue #1) in any pull request. The exercise's GitHub Actions workflows manage that issue. When you open a pull request for app work, link only the specific app work-item issue you are implementing.

## Persistence and hydration rules

- Persistence: bookmarks are stored in the browser using `localStorage`. There is no backend or external shortener service.
- Hydration: all browser-only code (anything touching `localStorage`) must run behind a client-side boundary so Astro's static build never touches `localStorage` during SSR. Use the `client:load` directive on interactive components, or an inline `<script>`, so this code only executes in the browser.
