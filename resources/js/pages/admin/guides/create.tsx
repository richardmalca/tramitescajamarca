import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import RequirementsEditor from '@/components/requirements-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as guidesIndex, store } from '@/routes/admin/guides';
import type { BreadcrumbItem, Category } from '@/types';

type PageProps = {
    categories: Category[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Trámites', href: guidesIndex() },
    { title: 'Nuevo trámite', href: store() },
];

export default function AdminGuideCreate({ categories }: PageProps) {
    const [requirements, setRequirements] = useState<string[]>([]);

    return (
        <>
            <Head title="Nuevo trámite" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Nuevo trámite"
                    description="Publica un nuevo trámite o guíalo como borrador"
                />

                <Form action={store()} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Categoría</Label>
                                <select
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
