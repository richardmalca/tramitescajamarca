import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import { index as guidesIndex } from '@/routes/guides';

export default function Navbar() {
    return (
        <header className="border-b border-[#E4DFD3]">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                <Link href={home().url} className="font-serif text-xl tracking-tight text-[#1F1E1D]">
                    Trámites <span className="text-[#C0603F]">Cajamarca</span>
                </Link>
                <nav className="flex items-center gap-8 text-sm font-medium text-[#5C574C]">
                    <Link href={guidesIndex().url} className="transition hover:text-[#1F1E1D]">
                        Todos los trámites
                    </Link>
                </nav>
            </div>
        </header>
    );
}
