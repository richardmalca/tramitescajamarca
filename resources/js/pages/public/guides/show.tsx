import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, MapPin, Wallet } from 'lucide-react';
import PublicLayout from '@/layouts/public/layout';
import { categoryIcon } from '@/lib/category-icons';
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

            <div className="border-b border-[#E4DFD3] bg-[#FAF7F0]">
                <div className="mx-auto max-w-3xl px-6 py-12">
                    <Link href={guidesIndex().url} className="inline-flex items-center gap-1.5 text-sm text-[#8A8474] hover:text-[#1F1E1D]">
                        <ArrowLeft className="size-4" />
                        Todos los trámites
                    </Link>

                    {guide.category && (
                        <span className="mt-5 flex w-fit items-center gap-1.5 rounded-full bg-[#EBD9C8] px-2.5 py-0.5 text-xs font-medium text-[#A94E30]">
                            {[guide.category].map((category) => {
                                const Icon = categoryIcon(category.slug);

                                return <Icon key={category.slug} className="size-3.5" />;
                            })}
                            {guide.category.name}
                        </span>
                    )}
                    <h1 className="mt-3 font-serif text-3xl text-[#1F1E1D] sm:text-4xl">{guide.title}</h1>
                    <p className="mt-3 text-lg text-[#5C574C]">{guide.summary}</p>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-6 py-12">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {guide.cost && (
                        <div className="flex items-center gap-3 rounded-2xl border border-[#E4DFD3] bg-white p-4 text-sm text-[#1F1E1D]">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#DCE3CF] text-[#5A6B45]">
                                <Wallet className="size-4" />
                            </span>
                            <span>
                                <strong className="block text-xs text-[#8A8474]">Costo</strong>
                                {guide.cost}
                            </span>
                        </div>
                    )}
                    {guide.where_to_go && (
                        <div className="flex items-center gap-3 rounded-2xl border border-[#E4DFD3] bg-white p-4 text-sm text-[#1F1E1D]">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EBD9C8] text-[#A94E30]">
                                <MapPin className="size-4" />
                            </span>
                            <span>
                                <strong className="block text-xs text-[#8A8474]">Dónde</strong>
                                {guide.where_to_go}
                            </span>
                        </div>
                    )}
                </div>

                {guide.steps && guide.steps.length > 0 && (
                    <div className="mt-10">
                        <h2 className="font-serif text-xl text-[#1F1E1D]">Pasos a seguir</h2>
                        <ol className="mt-4 flex flex-col gap-5">
                            {guide.steps.map((step, index) => (
                                <li key={index} className="flex items-start gap-3.5">
                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#C0603F] text-xs font-semibold text-white">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm leading-relaxed text-[#3A362E]">{step.text}</p>

                                        {step.image && (
                                            <img
                                                src={step.image}
                                                alt=""
                                                className="mt-3 w-full max-w-md rounded-xl border border-[#E4DFD3] object-cover"
                                                loading="lazy"
                                            />
                                        )}

                                        {step.link && (
                                            <a
                                                href={step.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#C0603F] px-3.5 py-1.5 text-xs font-medium text-[#C0603F] transition hover:bg-[#C0603F] hover:text-white"
                                            >
                                                {step.link_label || 'Ir al sitio'}
                                                <ArrowUpRight className="size-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {guide.requirements && guide.requirements.length > 0 && (
                    <div className="mt-10">
                        <h2 className="font-serif text-xl text-[#1F1E1D]">Requisitos</h2>
                        <ul className="mt-4 flex flex-col gap-2.5">
                            {guide.requirements.map((requirement, index) => (
                                <li key={index} className="flex items-start gap-2.5 text-sm text-[#3A362E]">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#C0603F]" />
                                    {requirement}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-10">
                    <h2 className="font-serif text-xl text-[#1F1E1D]">Detalle</h2>
                    <div className="mt-4 space-y-4 leading-relaxed whitespace-pre-line text-[#3A362E]">{guide.content}</div>
                </div>

                {guide.source_url && (
                    <a
                        href={guide.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#C0603F] hover:text-[#A94E30] hover:underline"
                    >
                        Ver fuente oficial
                        <ExternalLink className="size-3.5" />
                    </a>
                )}

                <div className="mt-16 rounded-2xl border border-[#E4DFD3] bg-[#FAF7F0] p-6">
                    <h3 className="font-serif text-lg text-[#1F1E1D]">¿Encontraste algo desactualizado o incorrecto?</h3>
                    <p className="mt-1 text-sm text-[#5C574C]">Ayúdanos a corregirlo — lo revisamos y actualizamos.</p>

                    <Form {...storeCorrection.form(guide.slug)} resetOnSuccess className="mt-5 flex flex-col gap-3">
                        {({ processing, errors, wasSuccessful }) => (
                            <>
                                <textarea
                                    name="message"
                                    required
                                    rows={3}
                                    placeholder="Cuéntanos qué está mal o desactualizado..."
                                    className="w-full rounded-xl border border-[#E4DFD3] bg-white px-3.5 py-2.5 text-sm text-[#1F1E1D] outline-none placeholder:text-[#B3AD9C] focus:border-[#C0603F] focus:ring-2 focus:ring-[#EBD9C8]"
                                />
                                {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Tu nombre (opcional)"
                                        className="w-full rounded-xl border border-[#E4DFD3] bg-white px-3.5 py-2.5 text-sm text-[#1F1E1D] outline-none placeholder:text-[#B3AD9C] focus:border-[#C0603F] focus:ring-2 focus:ring-[#EBD9C8]"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Tu correo (opcional)"
                                        className="w-full rounded-xl border border-[#E4DFD3] bg-white px-3.5 py-2.5 text-sm text-[#1F1E1D] outline-none placeholder:text-[#B3AD9C] focus:border-[#C0603F] focus:ring-2 focus:ring-[#EBD9C8]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="self-start rounded-full bg-[#C0603F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#A94E30] disabled:opacity-50"
                                >
                                    {processing ? 'Enviando...' : 'Enviar corrección'}
                                </button>

                                {wasSuccessful && <p className="text-sm text-[#5A6B45]">Gracias, revisaremos tu corrección pronto.</p>}
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </PublicLayout>
    );
}
