import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { show as guideShow } from '@/routes/guides';
import type { Guide } from '@/types/tramites';

export default function RecentGuides({ guides }: { guides: Guide[] }) {
    if (guides.length === 0) {
        return null;
    }

    return (
        <section className="border-t border-[#E4DFD3] bg-[#FAF7F0]">
            <div className="mx-auto max-w-5xl px-6 py-14">
                <h2 className="font-serif text-2xl text-[#1F1E1D]">Trámites recientes</h2>
                <p className="mt-1 text-sm text-[#8A8474]">Las últimas guías que se agregaron o actualizaron.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {guides.map((guide) => (
                        <Link
                            key={guide.id}
                            href={guideShow(guide.slug)}
                            className="group flex flex-col rounded-2xl border border-[#E4DFD3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#C0603F] hover:shadow-md"
                        >
                            {guide.category && (
                                <span className="w-fit rounded-full bg-[#EBD9C8] px-2.5 py-0.5 text-xs font-medium text-[#A94E30]">
                                    {guide.category.name}
                                </span>
                            )}
                            <div className="mt-3 font-medium text-[#1F1E1D] group-hover:text-[#C0603F]">{guide.title}</div>
                            <div className="mt-1 line-clamp-2 text-sm text-[#5C574C]">{guide.summary}</div>
                            <span className="mt-4 flex items-center gap-1 text-xs font-medium text-[#C0603F] opacity-0 transition group-hover:opacity-100">
                                Ver guía <ArrowRight className="size-3.5" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
