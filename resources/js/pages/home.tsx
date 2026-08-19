import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { index as guidesIndex, show as guideShow } from '@/routes/guides';
import type { Category, Guide } from '@/types/tramites';

type PageProps = {
    categories: Category[];
    recentGuides: Guide[];
};

export default function Home() {
    const { categories, recentGuides } = usePage<PageProps>().props;
    const [query, setQuery] = useState('');

    function handleSearch(event: React.FormEvent) {
        event.preventDefault();
        router.get(guidesIndex().url, query ? { q: query } : {});
    }

    return (
        <PublicLayout>
            <Head title="Información práctica para hacer trámites en Cajamarca" />

            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    ¿Qué trámite necesitas hacer?
                </h1>
                <p className="mt-3 text-muted-foreground">
                    Requisitos, costos y dónde ir para los trámites más comunes
                    en Cajamarca — explicado simple.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mx-auto mt-8 flex max-w-lg items-center gap-2"
                >
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Ej. DNI, licencia de conducir, partida de nacimiento..."
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
            </div>

            {categories.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">
                        Categorías
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={guidesIndex.url({
                                    query: { categoria: category.slug },
                                })}
                                className="rounded-lg border p-4 transition hover:border-primary hover:bg-muted/50"
                            >
                                <div className="font-medium">
                                    {category.name}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {category.guides_count ?? 0}{' '}
                                    {category.guides_count === 1
                                        ? 'trámite'
                                        : 'trámites'}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {recentGuides.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">
                        Trámites recientes
                    </h2>
                    <div className="mt-4 flex flex-col divide-y rounded-lg border">
                        {recentGuides.map((guide) => (
                            <Link
                                key={guide.id}
                                href={guideShow(guide.slug)}
                                className="p-4 transition hover:bg-muted/50"
                            >
                                <div className="font-medium">{guide.title}</div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {guide.summary}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
