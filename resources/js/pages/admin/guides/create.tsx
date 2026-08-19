import { Form, Head } from '@inertiajs/react';
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
import { index as guidesIndex, store } from '@/routes/admin/guides';
import { generate as generateWithAi } from '@/routes/admin/guides/ai';
import type { BreadcrumbItem, Category, GuideStep } from '@/types';

type PageProps = {
    categories: Category[];
};

type GuideDraft = {
    title?: string;
    summary?: string;
    content?: string;
    cost?: string;
    where_to_go?: string;
    requirements?: string[];
    steps?: { text: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Trámites', href: guidesIndex() },
    { title: 'Nuevo trámite', href: store() },
];

export default function AdminGuideCreate({ categories }: PageProps) {
    const [requirements, setRequirements] = useState<string[]>([]);
    const [steps, setSteps] = useState<GuideStep[]>([]);

    const categoryRef = useRef<HTMLSelectElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const summaryRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const costRef = useRef<HTMLInputElement>(null);
    const whereToGoRef = useRef<HTMLInputElement>(null);

    const [topic, setTopic] = useState('');
    const [generating, setGenerating] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    async function handleGenerate() {
        if (!topic.trim()) {
            return;
        }

        setGenerating(true);
        setAiError(null);

        try {
            const categoryId = categoryRef.current?.value ? Number(categoryRef.current.value) : undefined;
            const { draft } = await postJson<{ draft: GuideDraft }>(generateWithAi().url, { topic, category_id: categoryId });

            if (titleRef.current && draft.title) {
titleRef.current.value = draft.title;
}

            if (summaryRef.current && draft.summary) {
summaryRef.current.value = draft.summary;
}

            if (contentRef.current && draft.content) {
contentRef.current.value = draft.content;
}

            if (costRef.current && draft.cost) {
costRef.current.value = draft.cost;
}

            if (whereToGoRef.current && draft.where_to_go) {
whereToGoRef.current.value = draft.where_to_go;
}

            if (draft.requirements) {
setRequirements(draft.requirements);
}

            if (draft.steps) {
setSteps(draft.steps.map((step) => ({ text: step.text, link: null, link_label: null, image: null })));
}
        } catch (error) {
            setAiError(error instanceof Error ? error.message : 'No se pudo generar el borrador.');
        } finally {
            setGenerating(false);
        }
    }

    return (
        <>
            <Head title="Nuevo trámite" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Nuevo trámite"
                    description="Publica un nuevo trámite o guíalo como borrador"
                />

                <div className="max-w-2xl space-y-2 rounded-lg border border-dashed border-input p-4">
                    <Label htmlFor="ai_topic" className="flex items-center gap-1.5">
                        <Sparkles className="size-4" />
                        Generar borrador con IA
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Escribe el trámite (ej. &quot;Renovar DNI&quot;) y la IA arma un primer borrador para
                        que lo revises y ajustes antes de guardar. No inventes datos por tu cuenta — revisa
                        costos y direcciones exactas.
                    </p>
                    <div className="flex items-center gap-2">
                        <Input
                            id="ai_topic"
                            value={topic}
                            onChange={(event) => setTopic(event.target.value)}
                            placeholder="Ej. Sacar el brevete por primera vez"
                        />
                        <Button type="button" variant="outline" disabled={generating || !topic.trim()} onClick={handleGenerate}>
                            {generating ? 'Generando...' : 'Generar'}
                        </Button>
                    </div>
                    {aiError && <p className="text-sm text-destructive">{aiError}</p>}
                </div>

                <Form action={store()} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Categoría</Label>
                                <select
                                    ref={categoryRef}
                                    id="category_id"
                                    name="category_id"
                                    defaultValue=""
                                    required
                                    className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    <option value="" disabled>
                                        Selecciona una categoría
                                    </option>
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
                                    required
                                    placeholder="Una línea que explique de qué trata"
                                />
                                <InputError message={errors.summary} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Contenido</Label>
                                <textarea
                                    ref={contentRef}
                                    id="content"
                                    name="content"
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
                                        ref={costRef}
                                        id="cost"
                                        name="cost"
                                        placeholder="Ej. S/ 12.10 o Gratuito"
                                    />
                                    <InputError message={errors.cost} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="where_to_go">
                                        Dónde se hace
                                    </Label>
                                    <Input
                                        ref={whereToGoRef}
                                        id="where_to_go"
                                        name="where_to_go"
                                        placeholder="Ej. Municipalidad Provincial de Cajamarca"
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
                                    placeholder="https://..."
                                />
                                <InputError message={errors.source_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue="draft"
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
                                    : 'Guardar trámite'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminGuideCreate.layout = {
    breadcrumbs,
};
