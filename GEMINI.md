## Project Overview

This project is a React application built with Vite and TypeScript. It uses Tailwind CSS for styling and shadcn/ui for UI components. The application is configured to run on port 80 and includes security headers such as Content Security Policy.

## Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Dependencies:**
  - `react-router-dom` for routing
  - `@tanstack/react-query` for data fetching
  - `axios` for HTTP requests
  - `zod` for schema validation
  - `recharts` for charts
  - `date-fns` for date manipulation
  - `lucide-react` for icons
  - `ory-network` for authentication

## Project Structure

- `src/`: Contains the main application source code.
  - `components/`: Reusable UI components.
  - `pages/`: Application pages.
  - `lib/`: Utility functions.
  - `contexts/`: React contexts.
  - `hooks/`: Custom React hooks.
- `public/`: Static assets.
- `supabase/`: Supabase configuration and migrations.

## Development

- **Run development server:** `npm run vite`
- **Build for production:** `npm run build`
- **Linting:** `npm run lint`

## Deployment

The application is configured to be served from the root directory (`/`). The build output is created in the `dist` directory.
