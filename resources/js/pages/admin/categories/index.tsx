import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    destroy,
    index as categoriesIndex,
    store,
    update,
} from '@/routes/admin/categories';
import type { BreadcrumbItem, Category } from '@/types';

type PageProps = {
    categories: Category[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categorías', href: categoriesIndex() },
];

export default function AdminCategoriesIndex() {
    const { categories } = usePage<PageProps>().props;
    const [editing, setEditing] = useState<Category | null>(null);
    const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

    return (
        <>
            <Head title="Categorías" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Categorías"
                    description="Organiza los trámites por categoría"
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">
                            Nueva categoría
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={store()}
                            resetOnSuccess
                            className="flex flex-wrap items-end gap-3"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="Ej. Identidad"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Descripción (opcional)
                                        </Label>
                                        <Input
                                            id="description"
                                            name="description"
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creando...' : 'Crear'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Descripción
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Trámites
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {category.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {category.description ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {category.guides_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setEditing(category)
                                                    }
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        setPendingDelete(
                                                            category,
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {categories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            Aún no hay categorías.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Dialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar categoría</DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <Form
                            {...update.form(editing.id)}
                            onSuccess={() => setEditing(null)}
                            className="flex flex-col gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-name">
                                            Nombre
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            name="name"
                                            defaultValue={editing.name}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-description">
                                            Descripción
                                        </Label>
                                        <Input
                                            id="edit-description"
                                            name="description"
                                            defaultValue={
                                                editing.description ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-order">
                                            Orden
                                        </Label>
                                        <Input
                                            id="edit-order"
                                            type="number"
                                            name="order"
                                            defaultValue={editing.order}
                                        />
                                        <InputError message={errors.order} />
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Guardando...'
                                            : 'Guardar'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Eliminar categoría"
                description={
                    pendingDelete
                        ? `¿Eliminar "${pendingDelete.name}"? Los trámites de esta categoría también se eliminarán.`
                        : ''
                }
                onOpenChange={(open) => !open && setPendingDelete(null)}
                onConfirm={() => {
                    if (pendingDelete) {
                        router.delete(destroy(pendingDelete.id).url, {
                            preserveScroll: true,
                        });
                    }
                }}
            />
        </>
    );
}

AdminCategoriesIndex.layout = {
    breadcrumbs,
};
