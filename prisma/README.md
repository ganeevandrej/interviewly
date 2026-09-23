# Database setup

Prisma 7 connects to PostgreSQL on the server through `src/server/db.ts`.
Use `getDb()` only from server code. Connections are created lazily and reused.
The existing interface still uses localStorage until stages 2 and 3.

1. Copy `.env.example` to `.env.local` and fill in the PostgreSQL connection URI from Supabase > Connect.
2. Use `DATABASE_URL` for runtime access. For the Transaction pooler (6543), set `DIRECT_URL` to the Session pooler (5432) or a reachable direct connection for migrations.
3. URL-encode special characters in passwords. Keep TLS enabled in the connection URI.
4. Run `npm install`, `npm run db:validate`, `npm run db:migrate`, then `npm run db:check`.

The CLI and check script load .env.local, then .env without overriding existing environment variables.
Installation generates the client; generation requires no live database.
Migration deployment is explicit and never runs as part of installation or build.
The check uses the same server client and rolls back its own transaction.

## Schema

The database hierarchy is QuestionGroup -> Topic -> Question.
Each topic belongs to exactly one group; questions reference only topicId.
IDs remain strings supplied by callers. Question.position records ordering within a topic;
read with orderBy: [{ position: 'asc' }, { id: 'asc' }].

Topic.isDefault identifies the system topic displayed as "Без темы".
A partial unique index allows at most one default topic per group.
The stage 2 server API creates this topic with each group, protects it from removal/renaming,
and moves questions to it before deleting a regular topic in a transaction. See ../src/server/README.md.
Foreign keys cascade: deleting a group deletes its topics and their questions.
Directly deleting a topic also deletes its questions, so application deletion must perform
that move first. The db:check script verifies this sequence and group isolation.

There are no users or ownership fields. RLS blocks direct Data API access;
the server database role must have access (the Supabase postgres role does).

The group_topics migration targets the verified empty initial database and aborts if it
contains records. Existing localStorage v1/v2 remains untouched. During stage 4 import,
shared categories must become separate topics per group, and uncategorized questions
must reference their group's default topic. The browser still uses the old local model
until the server/interface stages are implemented.

## Migration ownership

Prisma owns application migrations in this directory. Apply them with Prisma, not a separate
Supabase migration history. Do not run migrate reset against the hosted project.
For future changes, generate and review migrations against a separate development database.

References:
- https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators
- https://supabase.com/docs/guides/database/connecting-to-postgres
