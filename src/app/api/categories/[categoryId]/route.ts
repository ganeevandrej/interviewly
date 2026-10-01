import { jsonBody, respond } from '@/server/http';
import { deleteCategory, readCategory, updateCategory } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ categoryId: string }> };

export async function GET(_request: Request, props: Context) {
    const { categoryId } = await props.params;

    return respond(() => readCategory(categoryId));
}

export async function PUT(request: Request, props: Context) {
    const { categoryId } = await props.params;

    return respond(async () => updateCategory(categoryId, await jsonBody(request)));
}

export async function DELETE(_request: Request, props: Context) {
    const { categoryId } = await props.params;

    return respond(() => deleteCategory(categoryId), 204);
}
