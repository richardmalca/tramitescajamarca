import { Head, router, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import PaginationLinks from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { index as guidesCreate } from '@/routes/admin/guides';
import {
    index as missedSearchesIndex,
    resolve,
} from '@/routes/admin/missed-searches';
import type { BreadcrumbItem, MissedSearch, Paginated } from '@/types';

type PageProps = {
    missedSearches: Paginated<MissedSearch>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Búsquedas sin resultado', href: missedSearchesIndex() },
];

export default function AdminMissedSearchesIndex() {
    const { missedSearches } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Búsquedas sin resultado" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Búsquedas sin resultado"
                    description="Lo que la gente busca y todavía no existe — ideas para el próximo trámite a escribir"
                />

                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Búsqueda
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Veces
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {missedSearches.data.map((missedSearch) => (
                                    <tr
                                        key={missedSearch.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {missedSearch.query}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">
                                                {missedSearch.occurrences}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <a
                                                        href={
                                                            guidesCreate().url
                                                        }
                                                    >
                                                        Escribir trámite
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(
                                                            resolve(
                                                                missedSearch.id,
                                                            ).url,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Marcar resuelto
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {missedSearches.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            Todavía no hay búsquedas sin
                                            resultado registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {missedSearches.last_page > 1 && (
                    <PaginationLinks links={missedSearches.links} />
                )}
            </div>
        </>
    );
}

AdminMissedSearchesIndex.layout = {
    breadcrumbs,
};
