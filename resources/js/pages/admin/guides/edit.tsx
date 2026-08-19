import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import RequirementsEditor from '@/components/requirements-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as guidesIndex, update } from '@/routes/admin/guides';
import type { BreadcrumbItem, Category, Guide } from '@/types';

type PageProps = {
    guide: Guide;
    categories: Category[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Trámites', href: guidesIndex() },
];

export default function AdminGuideEdit() {
    const { guide, categories } = usePage<PageProps>().props;
    const [requirements, setRequirements] = useState<string[]>(
        guide.requirements ?? [],
    );

    return (
        <>
            <Head title={`Editar — ${guide.title}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading title="Editar trámite" description={guide.title} />

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
