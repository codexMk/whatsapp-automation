## WhatsApp Automation SaaS Starter

Production-ready SaaS starter for WhatsApp automation for local businesses (clinics, coaching, shops, real estate, and service businesses).

### Tech stack

- **Next.js App Router** with TypeScript
- **Tailwind CSS**
- **Node.js API routes** (`app/api/*`)
- **PostgreSQL** with **Prisma ORM**
- **Email/password authentication scaffold**
- **Multi-tenant ready** via `userId` on all domain tables

### Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and adjust values:

   ```bash
   cp .env.example .env
   ```

3. **Set up database**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

### Project structure (high-level)

- `app/`
  - `layout.tsx` – root layout / theme
  - `page.tsx` – marketing / landing
  - `(auth)/login` & `(auth)/signup` – auth pages
  - `dashboard/*` – dashboard shell + core modules
  - `api/*` – REST-style API routes (customers, campaigns, automations, templates, auth)
- `components/`
  - `ui/*` – buttons, inputs, etc.
  - `layout/dashboard-shell.tsx` – sidebar layout for all dashboard routes
- `lib/`
  - `db.ts` – Prisma client
  - `auth.ts` – auth helpers (placeholders)
- `prisma/schema.prisma` – database models

### Multi-tenant model

- `User` is the tenant boundary.
- All core models (`Customer`, `Campaign`, `Automation`, `Template`, `BusinessSettings`) include a `userId` field that references `User`.
- API routes are structured to be user-scoped; replace the `"replace-with-session-user-id"` placeholders with your session logic.

### Next steps (you can extend)

- Implement real password hashing via `bcrypt` in `lib/auth.ts`.
- Add a session mechanism (NextAuth, custom JWT, or database sessions).
- Replace API placeholders with authenticated, user-scoped queries.
- Integrate your WhatsApp Business API provider in `settings` and a dedicated connection table.

