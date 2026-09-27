# Архитектура Interviewly

Проект использует Feature-Sliced Design с направлением зависимостей:

`app → views → widgets → features → entities → shared`

`server` — отдельный server-only слой для Prisma, базы данных, HTTP helpers и
валидации. `store` содержит Redux/RTK Query store.

## Слои

- `app` — маршруты Next.js, layouts, providers, loading/error/not-found и API handlers.
- `views` — композиция полноценных экранов.
- `widgets` — законченные блоки страниц.
- `features` — пользовательские действия и mutations.
- `entities` — модели, API и UI доменных сущностей.
- `shared` — нейтральные UI, типы, библиотеки, API и конфигурация.

Нейтральный UI из `shared` не зависит от доменных сущностей, features, widgets,
views или server. Client Components не импортируют `server` и Prisma.

Доменные типы находятся в `entities/*/model/types.ts`; составные типы,
связывающие несколько сущностей, находятся в `shared/types`.
