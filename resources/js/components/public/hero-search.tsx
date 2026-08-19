import { router } from '@inertiajs/react';
import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import { index as guidesIndex } from '@/routes/guides';
import type { Category } from '@/types/tramites';

export default function HeroSearch({ categories }: { categories: Category[] }) {
    const [query, setQuery] = useState('');

    function handleSearch(event: React.FormEvent) {
        event.preventDefault();
        router.get(guidesIndex().url, query ? { q: query } : {});
    }

    return (
        <section className="relative overflow-hidden bg-[#1F1E1D]">
            {/* Organic decorative shapes — purely visual, no data */}
            <svg
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-24 h-[380px] w-[380px] text-[#C0603F] opacity-20"
                viewBox="0 0 200 200"
                fill="currentColor"
            >
                <path d="M45.3,-58.5C57.9,-49.9,66.2,-34.5,69.6,-18.1C73.1,-1.7,71.7,15.7,63.9,29.6C56.1,43.5,41.9,53.9,26.4,60.6C10.9,67.3,-5.9,70.3,-21.5,66.4C-37.1,62.5,-51.5,51.7,-60.6,37.3C-69.6,22.9,-73.3,4.9,-69.8,-11.3C-66.3,-27.6,-55.6,-42.1,-42,-51C-28.3,-59.9,-14.2,-63.2,1.6,-65.3C17.3,-67.4,34.7,-67.1,45.3,-58.5Z" transform="translate(100 100)" />
            </svg>
            <svg
                aria-hidden
                className="pointer-events-none absolute -bottom-32 -left-20 h-[300px] w-[300px] text-[#7C8A63] opacity-25"
                viewBox="0 0 200 200"
                fill="currentColor"
            >
                <path d="M39.2,-49.6C51.5,-41.2,62.5,-28.9,66.4,-14.3C70.3,0.3,67.1,17.2,58.4,30.6C49.7,44,35.5,53.9,19.7,59.2C3.9,64.5,-13.5,65.2,-28.9,59.6C-44.3,54,-57.7,42.1,-64.5,27.1C-71.3,12.1,-71.5,-6,-64.9,-20.8C-58.3,-35.6,-44.9,-47.1,-30.7,-55C-16.5,-62.9,-1.5,-67.2,11.9,-64.9C25.3,-62.6,26.9,-58,39.2,-49.6Z" transform="translate(100 100)" />
            </svg>

            <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
                <p className="text-sm font-medium tracking-wide text-[#E8A582] uppercase">Guía para Cajamarca</p>
                <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl">
                    Tu ciudad, tus trámites, sin vueltas.
                </h1>
                <p className="mt-4 max-w-xl text-lg text-[#C9C4B6]">
                    Requisitos, costos y a dónde ir para los trámites más comunes en Cajamarca — explicado simple, por gente de acá.
                </p>

                <form onSubmit={handleSearch} className="mt-9 flex max-w-xl items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8A8474]" />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="¿Qué trámite necesitas hacer hoy?"
                            className="w-full rounded-full border border-transparent bg-white py-3.5 pr-4 pl-11 text-sm text-[#1F1E1D] shadow-lg outline-none placeholder:text-[#B3AD9C] focus:ring-2 focus:ring-[#C0603F]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-full bg-[#C0603F] px-6 py-3.5 text-sm font-medium text-white shadow-lg transition hover:bg-[#A94E30]"
                    >
                        Buscar
                        <ArrowRight className="size-4" />
                    </button>
                </form>

                {categories.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium tracking-wide text-[#8A8474] uppercase">Populares:</span>
                        {categories.slice(0, 4).map((category) => (
                            <a
                                key={category.id}
                                href={guidesIndex.url({ query: { categoria: category.slug } })}
                                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-[#E8E4D8] transition hover:border-white/30 hover:bg-white/10"
                            >
                                {category.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
