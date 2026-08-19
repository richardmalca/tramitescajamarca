import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types/tramites';

export default function PaginationLinks({
    links,
}: {
    links: PaginationLink[];
}) {
    return (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-1">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`rounded-md px-3 py-1.5 text-sm ${
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="rounded-md px-3 py-1.5 text-sm text-muted-foreground/50"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
