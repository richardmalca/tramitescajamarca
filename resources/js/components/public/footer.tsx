import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import { index as guidesIndex } from '@/routes/guides';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#1F1E1D] text-[#C9C4B6]">
            <div className="mx-auto max-w-5xl px-6 py-14">
                <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr]">
                    <div>
                        <Link href={home().url} className="font-serif text-xl tracking-tight text-white">
                            Trámites <span className="text-[#E8A582]">Cajamarca</span>
                        </Link>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#9C9686]">
                            Información práctica para hacer trámites en Cajamarca, Perú — requisitos, costos y a dónde ir, explicado simple, por
                            gente de acá.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium tracking-wide text-[#E8A582] uppercase">Explorar</p>
                        <nav className="mt-3 flex flex-col gap-2 text-sm">
                            <Link href={home().url} className="w-fit transition hover:text-white">
                                Inicio
                            </Link>
                            <Link href={guidesIndex().url} className="w-fit transition hover:text-white">
                                Todos los trámites
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-[#8A8474] sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {new Date().getFullYear()} Trámites Cajamarca.</p>
                    <p>Contenido informativo, no oficial. Verifica siempre en la entidad correspondiente.</p>
                </div>
            </div>
        </footer>
    );
}
