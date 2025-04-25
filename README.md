# Vibe Coded Recipe Timer App

A React application for managing recipes with timers for each step.

99% of the business logic is written by AI using Cursor, GitHub Copilot, and Windsurf.
Some of the CSS is handwritten.

## Features

- Create and manage recipes
- Add steps with timers
- Edit recipe titles and steps
- Upload images for steps
- Timer completion notifications with sound and visual effects

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Dploy to GitHub Pages
npm run deploy

```

## Deployment to GitHub Pages

1. Make sure you have a GitHub repository named `recipe-timer`
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Build and deploy:
   ```bash
   npm run deploy
   ```

The app will be available at: `https://[your-username].github.io/recipe-timer/`

## Configuration

- Make sure your repository name matches the `base` path in `vite.config.ts`
- Update the repository URL in your package.json if needed

## Technologies Used

- React
- TypeScript
- Vite
- CSS Modules
- Local Storage for data persistence
