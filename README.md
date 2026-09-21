# SSTC Web Platform

The SSTC web platform is the digital foundation for SSTC's public website and future business operations.

## Stack

- React 19
- TypeScript
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS
- Supabase
- Lovable

## Local development

Requirements: Node.js 22+ and npm.

```bash
git clone https://github.com/karisajoshua/glow-up-hub-673.git
cd glow-up-hub-673
npm install
cp .env.example .env
npm run dev
```

## Environment configuration

Do not commit real environment files or privileged credentials. Copy `.env.example` to `.env` and provide the required Supabase values locally or in the deployment provider's environment settings.

Only browser-safe Supabase publishable keys may be exposed to Vite. Never expose a Supabase service-role key in client-side variables.

## Quality checks

```bash
npm run lint
npm run build
```

## Production direction

The platform can be extended from the SSTC public website into an operational system covering client management, projects, leads, proposals and quotations, contracts, invoicing, support, analytics, and AI-assisted workflows.

## Deployment

The project can be developed through Lovable or a standard Git workflow. Production environment variables should be configured in the hosting platform rather than committed to Git.

Live Lovable app: https://glow-up-hub-673.lovable.app
