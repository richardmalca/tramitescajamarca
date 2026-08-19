import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    MapPin,
    Wallet,
} from 'lucide-react';
import InputError from '@/components/input-error';
import PublicLayout from '@/layouts/public-layout';
import { store as storeCorrection } from '@/routes/corrections';
import { index as guidesIndex } from '@/routes/guides';
import type { Guide } from '@/types/tramites';

type PageProps = {
    guide: Guide;
};

export default function GuideShow() {
    const { guide } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <Head title={`${guide.title} — Trámites Cajamarca`} />

            <Link
                href={guidesIndex()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Todos los trámites
            </Link>

            {guide.category && (
                <p className="mt-4 text-sm font-medium text-primary">
                    {guide.category.name}
                </p>
            )}
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {guide.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
                {guide.summary}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {guide.cost && (
                    <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                        <Wallet className="size-4 shrink-0 text-muted-foreground" />
                        <span>
                            <strong>Costo:</strong> {guide.cost}
                        </span>
                    </div>
                )}
                {guide.where_to_go && (
                    <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                        <MapPin className="size-4 shrink-0 text-muted-foreground" />
                        <span>
                            <strong>Dónde:</strong> {guide.where_to_go}
                        </span>
                    </div>
                )}
            </div>

            {guide.requirements && guide.requirements.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold">Requisitos</h2>
                    <ul className="mt-3 flex flex-col gap-2">
                        {guide.requirements.map((requirement, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-sm"
                            >
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                {requirement}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-lg font-semibold">Detalle</h2>
                <div className="mt-3 space-y-4 leading-relaxed whitespace-pre-line text-foreground">
                    {guide.content}
                </div>
            </div>

            {guide.source_url && (
                <a
                    href={guide.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                    Ver fuente oficial
                    <ExternalLink className="size-3.5" />
                </a>
            )}

            <div className="mt-16 rounded-lg border bg-muted/30 p-5">
                <h3 className="font-semibold">
                    ¿Encontraste algo desactualizado o incorrecto?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Ayúdanos a corregirlo — lo revisamos y actualizamos.
                </p>

                <Form
                    {...storeCorrection.form(guide.slug)}
                    resetOnSuccess
                    className="mt-4 flex flex-col gap-3"
                >
                    {({ processing, errors, wasSuccessful }) => (
                        <>
                            <textarea
                                name="message"
                                required
                                rows={3}
                                placeholder="Cuéntanos qué está mal o desactualizado..."
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.message} />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Tu nombre (opcional)"
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Tu correo (opcional)"
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                            >
                                {processing
                                    ? 'Enviando...'
                                    : 'Enviar corrección'}
                            </button>

                            {wasSuccessful && (
                                <p className="text-sm text-emerald-600">
                                    Gracias, revisaremos tu corrección pronto.
                                </p>
                            )}
                        </>
                    )}
                </Form>
            </div>
        </PublicLayout>
    );
}
