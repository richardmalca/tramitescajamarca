import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import PaginationLinks from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    create,
    destroy,
    edit,
    index as guidesIndex,
} from '@/routes/admin/guides';
import type { BreadcrumbItem, Guide, Paginated } from '@/types';

type PageProps = {
    guides: Paginated<Guide>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Trámites', href: guidesIndex() },
];

export default function AdminGuidesIndex() {
    const { guides } = usePage<PageProps>().props;
    const [pendingDelete, setPendingDelete] = useState<Guide | null>(null);

    return (
        <>
            <Head title="Trámites" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Trámites"
                        description="Gestiona el contenido publicado"
                    />
                    <Button asChild>
                        <Link href={create()}>Nuevo trámite</Link>
                    </Button>
                </div>

                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Título
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Categoría
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {guides.data.map((guide) => (
                                    <tr
                                        key={guide.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {guide.title}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {guide.category?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    guide.status === 'published'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {guide.status === 'published'
                                                    ? 'Publicado'
                                                    : 'Borrador'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link href={edit(guide.id)}>
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        setPendingDelete(guide)
                                                    }
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {guides.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            Aún no hay trámites. Crea el
                                            primero.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {guides.last_page > 1 && (
                    <PaginationLinks links={guides.links} />
                )}
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Eliminar trámite"
                description={
                    pendingDelete
                        ? `¿Eliminar "${pendingDelete.title}"? Esta acción no se puede deshacer.`
                        : ''
                }
                onOpenChange={(open) => !open && setPendingDelete(null)}
                onConfirm={() => {
                    if (pendingDelete) {
                        router.delete(destroy(pendingDelete.id).url, {
                            preserveScroll: true,
                        });
                    }
                }}
            />
        </>
    );
}

AdminGuidesIndex.layout = {
    breadcrumbs,
};
