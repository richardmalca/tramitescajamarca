import { Form, Head, usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import RequirementsEditor from '@/components/requirements-editor';
import StepsEditor from '@/components/steps-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { postJson } from '@/lib/api';
import { index as guidesIndex, update } from '@/routes/admin/guides';
import { improve as improveWithAi } from '@/routes/admin/guides/ai';
import type { BreadcrumbItem, Category, Guide, GuideStep } from '@/types';

type PageProps = {
    guide: Guide;
    categories: Category[];
};

type GuideTextDraft = {
    title?: string;
    summary?: string;
    content?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Trámites', href: guidesIndex() },
];

export default function AdminGuideEdit() {
    const { guide, categories } = usePage<PageProps>().props;
    const [requirements, setRequirements] = useState<string[]>(
        guide.requirements ?? [],
    );
    const [steps, setSteps] = useState<GuideStep[]>(guide.steps ?? []);

    const titleRef = useRef<HTMLInputElement>(null);
    const summaryRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [improving, setImproving] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    async function handleImprove() {
        setImproving(true);
        setAiError(null);

        try {
            const { draft } = await postJson<{ draft: GuideTextDraft }>(improveWithAi(guide.id).url);

            if (titleRef.current && draft.title) {
titleRef.current.value = draft.title;
}

            if (summaryRef.current && draft.summary) {
summaryRef.current.value = draft.summary;
}

            if (contentRef.current && draft.content) {
contentRef.current.value = draft.content;
}
        } catch (error) {
            setAiError(error instanceof Error ? error.message : 'No se pudo mejorar el contenido.');
        } finally {
            setImproving(false);
        }
    }

    return (
        <>
            <Head title={`Editar — ${guide.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading title="Editar trámite" description={guide.title} />

                <div className="flex max-w-2xl items-center justify-between gap-3 rounded-lg border border-dashed border-input p-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Sparkles className="size-4 shrink-0" />
                        Pide a la IA que mejore la redacción del título, resumen y contenido actuales.
                    </div>
                    <Button type="button" variant="outline" disabled={improving} onClick={handleImprove} className="shrink-0">
                        {improving ? 'Mejorando...' : 'Mejorar con IA'}
                    </Button>
                </div>
                {aiError && <p className="max-w-2xl text-sm text-destructive">{aiError}</p>}

                <Form
                    {...update.form(guide.id)}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Categoría</Label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    defaultValue={guide.category_id}
                                    required
                                    className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    ref={titleRef}
                                    id="title"
                                    name="title"
                                    defaultValue={guide.title}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="summary">Resumen</Label>
                                <Input
                                    ref={summaryRef}
                                    id="summary"
                                    name="summary"
                                    defaultValue={guide.summary}
                                    required
                                />
                                <InputError message={errors.summary} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Contenido</Label>
                                <textarea
                                    ref={contentRef}
                                    id="content"
                                    name="content"
                                    defaultValue={guide.content}
                                    required
                                    rows={10}
                                    className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                <InputError message={errors.content} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cost">Costo</Label>
                                    <Input
                                        id="cost"
                                        name="cost"
                                        defaultValue={guide.cost ?? ''}
                                        placeholder="Ej. S/ 12.10 o Gratuito"
                                    />
                                    <InputError message={errors.cost} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="where_to_go">
                                        Dónde se hace
                                    </Label>
                                    <Input
                                        id="where_to_go"
                                        name="where_to_go"
                                        defaultValue={guide.where_to_go ?? ''}
                                    />
                                    <InputError message={errors.where_to_go} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Requisitos</Label>
                                <RequirementsEditor
                                    value={requirements}
                                    onChange={setRequirements}
                                    name="requirements"
                                />
                                <InputError message={errors.requirements} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Pasos</Label>
                                <p className="text-sm text-muted-foreground">
                                    El proceso en orden. Cada paso puede
                                    llevar un enlace (ej. para pagar en línea)
                                    y una imagen opcional.
                                </p>
                                <StepsEditor
                                    value={steps}
                                    onChange={setSteps}
                                    name="steps"
                                />
                                <InputError message={errors.steps} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="source_url">
                                    Fuente (opcional)
                                </Label>
                                <Input
                                    id="source_url"
                                    type="url"
                                    name="source_url"
                                    defaultValue={guide.source_url ?? ''}
                                    placeholder="https://..."
                                />
                                <InputError message={errors.source_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={guide.status}
                                    className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    <option value="draft">Borrador</option>
                                    <option value="published">Publicado</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Guardando...'
                                    : 'Guardar cambios'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminGuideEdit.layout = {
    breadcrumbs,
};
