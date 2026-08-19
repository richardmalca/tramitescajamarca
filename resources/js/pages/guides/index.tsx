import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import PaginationLinks from '@/components/pagination-links';
import PublicLayout from '@/layouts/public-layout';
import { index as guidesIndex, show as guideShow } from '@/routes/guides';
import type { Category, Guide, Paginated } from '@/types/tramites';

type PageProps = {
    guides: Paginated<Guide>;
    categories: Category[];
    filters: {
        q: string | null;
        categoria: string | null;
    };
};

export default function GuidesIndex() {
    const { guides, categories, filters } = usePage<PageProps>().props;
    const [query, setQuery] = useState(filters.q ?? '');

    function handleSearch(event: React.FormEvent) {
        event.preventDefault();
        router.get(
            guidesIndex.url({
                query: {
                    q: query || undefined,
                    categoria: filters.categoria ?? undefined,
                },
            }),
        );
    }

    function selectCategory(slug: string | null) {
        router.get(
            guidesIndex.url({
                query: {
                    q: filters.q ?? undefined,
                    categoria: slug ?? undefined,
                },
            }),
        );
    }

    return (
        <PublicLayout>
            <Head title="Todos los trámites — Trámites Cajamarca" />

            <h1 className="text-2xl font-bold tracking-tight">
                Todos los trámites
            </h1>

            <form
                onSubmit={handleSearch}
                className="mt-6 flex items-center gap-2"
            >
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar trámite..."
                        className="w-full rounded-md border border-input bg-transparent py-2.5 pr-3 pl-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                    Buscar
                </button>
            </form>

            {categories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => selectCategory(null)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            !filters.categoria
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'text-muted-foreground'
                        }`}
                    >
                        Todas
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => selectCategory(category.slug)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                filters.categoria === category.slug
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-8 flex flex-col divide-y rounded-lg border">
                {guides.data.map((guide) => (
                    <Link
                        key={guide.id}
                        href={guideShow(guide.slug)}
                        className="p-4 transition hover:bg-muted/50"
                    >
                        {guide.category && (
                            <div className="text-xs font-medium text-primary">
                                {guide.category.name}
                            </div>
                        )}
                        <div className="mt-1 font-medium">{guide.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                            {guide.summary}
                        </div>
                    </Link>
                ))}

                {guides.data.length === 0 && (
                    <div className="p-10 text-center text-muted-foreground">
                        No encontramos ningún trámite para tu búsqueda. Intenta
                        con otras palabras.
                    </div>
                )}
            </div>

            {guides.last_page > 1 && <PaginationLinks links={guides.links} />}
        </PublicLayout>
    );
}
