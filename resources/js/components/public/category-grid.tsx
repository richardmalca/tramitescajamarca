import { Link } from '@inertiajs/react';
import { CATEGORY_TINTS, categoryIcon } from '@/lib/category-icons';
import { index as guidesIndex } from '@/routes/guides';
import type { Category } from '@/types/tramites';

export default function CategoryGrid({ categories }: { categories: Category[] }) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-5xl px-6 py-14">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="font-serif text-2xl text-[#1F1E1D]">Accesos rápidos</h2>
                    <p className="mt-1 text-sm text-[#8A8474]">Guías paso a paso hechas por y para vecinos de Cajamarca.</p>
                </div>
                <Link href={guidesIndex().url} className="hidden text-sm font-medium text-[#C0603F] hover:text-[#A94E30] sm:block">
                    Ver todos →
                </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {categories.map((category, index) => {
                    const Icon = categoryIcon(category.slug);

                    return (
                        <Link
                            key={category.id}
                            href={guidesIndex.url({ query: { categoria: category.slug } })}
                            className="group rounded-2xl border border-[#E4DFD3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#C0603F] hover:shadow-md"
                        >
                            <span
                                className={`inline-flex size-10 items-center justify-center rounded-xl ${CATEGORY_TINTS[index % CATEGORY_TINTS.length]}`}
                            >
                                <Icon className="size-5" />
                            </span>
                            <div className="mt-4 font-medium text-[#1F1E1D] group-hover:text-[#C0603F]">{category.name}</div>
                            <div className="mt-1 text-xs text-[#8A8474]">
                                {category.guides_count ?? 0} {category.guides_count === 1 ? 'trámite' : 'trámites'}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <Link href={guidesIndex().url} className="mt-6 block text-center text-sm font-medium text-[#C0603F] hover:text-[#A94E30] sm:hidden">
                Ver todos los trámites →
            </Link>
        </section>
    );
}
