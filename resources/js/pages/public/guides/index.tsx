import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import PublicPaginationLinks from '@/components/public/pagination-links';
import PublicLayout from '@/layouts/public/layout';
import { categoryIcon } from '@/lib/category-icons';
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
        router.get(guidesIndex.url({ query: { q: query || undefined, categoria: filters.categoria ?? undefined } }));
    }

    function selectCategory(slug: string | null) {
        router.get(guidesIndex.url({ query: { q: filters.q ?? undefined, categoria: slug ?? undefined } }));
    }

    return (
        <PublicLayout>
            <Head title="Todos los trámites — Trámites Cajamarca" />

            <div className="border-b border-[#E4DFD3] bg-[#FAF7F0]">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    <p className="text-sm font-medium tracking-wide text-[#C0603F] uppercase">Directorio</p>
                    <h1 className="mt-2 font-serif text-3xl text-[#1F1E1D] sm:text-4xl">Todos los trámites</h1>
                    <p className="mt-2 text-[#5C574C]">Busca por nombre o filtra por categoría.</p>

                    <form onSubmit={handleSearch} className="mt-8 flex max-w-lg items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8A8474]" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Buscar trámite..."
                                className="w-full rounded-full border border-[#E4DFD3] bg-white py-3 pr-4 pl-11 text-sm text-[#1F1E1D] shadow-sm outline-none placeholder:text-[#B3AD9C] focus:border-[#C0603F] focus:ring-2 focus:ring-[#EBD9C8]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-full bg-[#C0603F] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#A94E30]"
                        >
                            Buscar
                        </button>
                    </form>

                    {categories.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => selectCategory(null)}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                                    !filters.categoria
                                        ? 'border-[#C0603F] bg-[#C0603F] text-white'
                                        : 'border-[#E4DFD3] bg-white text-[#5C574C] hover:border-[#C0603F]'
                                }`}
                            >
                                Todas
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => selectCategory(category.slug)}
                                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                                        filters.categoria === category.slug
                                            ? 'border-[#C0603F] bg-[#C0603F] text-white'
                                            : 'border-[#E4DFD3] bg-white text-[#5C574C] hover:border-[#C0603F]'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-6 py-12">
                {guides.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {guides.data.map((guide) => {
                            const Icon = guide.category ? categoryIcon(guide.category.slug) : null;

                            return (
                                <Link
                                    key={guide.id}
                                    href={guideShow(guide.slug)}
                                    className="group flex flex-col rounded-2xl border border-[#E4DFD3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#C0603F] hover:shadow-md"
                                >
                                    {guide.category && (
                                        <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#EBD9C8] px-2.5 py-0.5 text-xs font-medium text-[#A94E30]">
                                            {Icon && <Icon className="size-3.5" />}
                                            {guide.category.name}
                                        </span>
                                    )}
                                    <div className="mt-3 font-medium text-[#1F1E1D] group-hover:text-[#C0603F]">{guide.title}</div>
                                    <div className="mt-1 line-clamp-2 text-sm text-[#5C574C]">{guide.summary}</div>
                                    <span className="mt-4 flex items-center gap-1 text-xs font-medium text-[#C0603F] opacity-0 transition group-hover:opacity-100">
                                        Ver guía <ArrowRight className="size-3.5" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#E4DFD3] bg-[#FAF7F0] p-14 text-center text-[#8A8474]">
                        No encontramos ningún trámite para tu búsqueda. Intenta con otras palabras.
                    </div>
                )}

                {guides.last_page > 1 && <PublicPaginationLinks links={guides.links} />}
            </div>
        </PublicLayout>
    );
}
