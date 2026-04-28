# Contributing to PMS

Thank you for your interest in contributing! PMS is a free, open-source tool built for the prompt engineering community.

## How to Contribute

### Reporting Bugs
Open a GitHub Issue with:
- Steps to reproduce
- Expected vs actual behavior
- Node.js version (`node --version`)
- OS (Windows / macOS / Linux)

### Suggesting Features
Open a GitHub Issue labelled `enhancement`. Describe the use case and why it would benefit users.

### Pull Requests
1. Fork → create feature branch → commit → push → open PR
2. Keep PRs focused — one feature or fix per PR
3. Test manually before submitting
4. Update README if you add a new feature or change the API

## Code Style
- Plain Node.js + Express — no TypeScript, no build step
- Vanilla JS frontend — no frameworks, no bundler
- Keep dependencies minimal
- All data operations go through `lib/db.js`
- New AI providers belong in `lib/ai.js`

## Adding a New AI Provider
1. Add the provider definition to `PROVIDER_TYPES` in `lib/ai.js`
2. Add a caller function (follow the existing pattern)
3. Add it to the `switch` in `runPrompt()`
4. Test with a real API key

## Local Development
```bash
git clone https://github.com/your-username/prompt-management-system.git
cd prompt-management-system
npm install
npm start
# → http://localhost:5500
```

## License
By contributing, you agree your contributions will be licensed under MIT.
