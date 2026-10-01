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

The knowledge-base hierarchy is Category -> Topic, with Question as an independent entity.
`CategoryQuestion` gives every question exactly one category and stores its position within it.
`TopicQuestion` optionally gives a question one topic and stores its position within that topic.
Both links use a composite primary key and a unique `questionId`, so a question cannot belong to
more than one category or topic. IDs remain strings supplied by callers.

There is no system topic or "Без темы" entity. A question without `TopicQuestion` is displayed
directly in its category. The server must validate that a question linked to a topic belongs to
the same category as that topic.

Deleting a topic removes its `TopicQuestion`, `TopicTag`, and `TrainingTopic` links, while its
questions remain in their categories. Deleting a question removes its category, topic, story,
project, and training links. Deleting a category must be implemented by the server as a
transaction: delete every linked question first, then delete the category; this also cascades to
its topics and their links. A database foreign key alone cannot cascade from a category through
the `CategoryQuestion` join table to `Question`.

`StoryQuestion` and `ProjectQuestion` each allow a question to belong to at most one story or
project. Before adding the `StoryQuestion.questionId` unique constraint to an existing database,
the migration must detect and report conflicting links instead of silently discarding them.

Training stores its state, selection mode, question order and optional time limit per question.
`TrainingCategory` and `TrainingTopic` retain the selected filters; `TrainingQuestion` retains
the generated question set, ordering and progress. Foreign keys remove affected training filters
and questions when their referenced entities are deleted. Repeating a training uses its stored
questions; regeneration only shuffles that saved set.

There are no users or ownership fields. RLS blocks direct Data API access;
the server database role must have access (the Supabase postgres role does).

The pending category/training migration must rename `QuestionGroup` to `Category`, create
`CategoryQuestion` from the current question topic and its group's id, create `TopicQuestion`
only for ordinary topics, then remove `Question.topicId`, `Topic.isDefault`, and the system
topics. It must preserve positions and fail with a clear report if existing story links conflict.
Existing localStorage remains untouched until the server and interface stages are implemented.

## Migration ownership

Prisma owns application migrations in this directory. Apply them with Prisma, not a separate
Supabase migration history. Do not run migrate reset against the hosted project.
For future changes, generate and review migrations against a separate development database.

References:

- https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators
- https://supabase.com/docs/guides/database/connecting-to-postgres
