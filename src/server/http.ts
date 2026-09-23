import 'server-only';
import { Prisma } from '../generated/prisma/client';
import { InputError } from './validation';

export async function jsonBody(request: Request): Promise<unknown> {
  if (
    request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json'
  )
    throw new InputError('Ожидается Content-Type: application/json.', 415);
  try {
    return await request.json();
  } catch {
    throw new InputError('Некорректный JSON.');
  }
}
export async function respond(operation: () => Promise<unknown>, status = 200): Promise<Response> {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const data = await operation();
    return status === 204
      ? new Response(null, { status, headers })
      : Response.json({ data }, { status, headers });
  } catch (error) {
    if (error instanceof InputError)
      return Response.json({ error: error.message }, { status: error.status, headers });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025')
        return Response.json({ error: 'Запись не найдена.' }, { status: 404, headers });
      if (['P2002', 'P2003', 'P2034'].includes(error.code))
        return Response.json(
          { error: 'Конфликт изменения данных. Повторите запрос.' },
          { status: 409, headers },
        );
    }
    // Never expose driver messages, SQL or connection credentials.
    console.error(
      'Database request failed',
      error instanceof Prisma.PrismaClientKnownRequestError ? error.code : 'unknown',
    );
    return Response.json(
      { error: 'Не удалось выполнить операцию с БД.' },
      { status: 500, headers },
    );
  }
}
