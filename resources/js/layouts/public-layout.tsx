import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { home } from '@/routes';
import { index as guidesIndex } from '@/routes/guides';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <header className="border-b">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                    <Link
                        href={home()}
                        className="text-lg font-bold tracking-tight"
                    >
                        Trámites <span className="text-primary">Cajamarca</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link
                            href={guidesIndex()}
                            className="hover:text-primary"
                        >
                            Todos los trámites
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
                {children}
            </main>

            <footer className="border-t py-8 text-center text-sm text-muted-foreground">
                <p>
                    Trámites Cajamarca — información práctica para hacer
                    trámites en Cajamarca, Perú.
                </p>
                <p className="mt-1">
                    Contenido informativo, no oficial. Verifica siempre en la
                    entidad correspondiente.
                </p>
            </footer>
        </div>
    );
}
