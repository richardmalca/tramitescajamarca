import type { PropsWithChildren } from 'react';
import Footer from '@/components/public/footer';
import Navbar from '@/components/public/navbar';

/**
 * Shell for every public-facing page. Always renders light/warm regardless
 * of the visitor's system theme preference — colors here are explicit
 * (no CSS-variable tokens, no dark: variants) on purpose. See PublicLayout
 * history: the admin panel still follows shadcn's theme, this doesn't.
 */
export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-svh flex-col bg-[#F5F1E8] text-[#1F1E1D]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
