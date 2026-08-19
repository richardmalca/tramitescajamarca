import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types/tramites';

/**
 * Plain-color counterpart to any shadcn pagination — public pages stay warm
 * and light regardless of system theme, so this uses explicit Tailwind
 * colors matching the rest of the public site instead of CSS-variable tokens.
 */
export default function PublicPaginationLinks({ links }: { links: PaginationLink[] }) {
    return (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                            link.active ? 'bg-[#C0603F] text-white' : 'text-[#5C574C] hover:bg-[#EBD9C8]'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="rounded-full px-3.5 py-1.5 text-sm text-[#B3AD9C]"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
