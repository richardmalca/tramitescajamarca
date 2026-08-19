import { Head, Link, router, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import PaginationLinks from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    apply,
    dismiss,
    index as correctionsIndex,
} from '@/routes/admin/corrections';
import { edit as editGuide } from '@/routes/admin/guides';
import type { BreadcrumbItem, Correction, Paginated } from '@/types';

type PageProps = {
    corrections: Paginated<Correction>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Correcciones', href: correctionsIndex() },
];

function formatDate(value?: string): string {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleString('es', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AdminCorrectionsIndex() {
    const { corrections } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Correcciones" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Correcciones"
                    description="Sugerencias de visitantes esperando revisión"
                />

                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Trámite
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Mensaje
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        De
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Fecha
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {corrections.data.map((correction) => (
                                    <tr
                                        key={correction.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {correction.guide ? (
                                                <Link
                                                    href={editGuide(
                                                        correction.guide.id,
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {correction.guide.title}
                                                </Link>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="max-w-sm px-4 py-3 text-muted-foreground">
                                            {correction.message}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {correction.name ??
                                                correction.email ??
                                                'Anónimo'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {formatDate(correction.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(
                                                            apply(correction.id)
                                                                .url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Aplicada
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(
                                                            dismiss(
                                                                correction.id,
                                                            ).url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Descartar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {corrections.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No hay correcciones pendientes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {corrections.last_page > 1 && (
                    <PaginationLinks links={corrections.links} />
                )}
            </div>
        </>
    );
}

AdminCorrectionsIndex.layout = {
    breadcrumbs,
};
