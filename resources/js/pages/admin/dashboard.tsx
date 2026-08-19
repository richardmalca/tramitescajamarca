import { Head, Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, FileEdit, HelpCircle, Search } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes/admin';
import { index as guidesIndex } from '@/routes/admin/guides';
import type { BreadcrumbItem, DashboardStats } from '@/types';

type PageProps = {
    stats: DashboardStats;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Panel', href: dashboard() }];

function StatCard({
    title,
    value,
    icon: Icon,
}: {
    title: string;
    value: number;
    icon: LucideIcon;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">
                    {value.toLocaleString('es')}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    const { stats } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Panel" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Panel"
                        description="Resumen de Trámites Cajamarca"
                    />
                    <Link
                        href={guidesIndex()}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Ver trámites
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Trámites publicados"
                        value={stats.published_guides}
                        icon={BookOpen}
                    />
                    <StatCard
                        title="Borradores"
                        value={stats.draft_guides}
                        icon={FileEdit}
                    />
                    <StatCard
                        title="Correcciones pendientes"
                        value={stats.pending_corrections}
                        icon={HelpCircle}
                    />
                    <StatCard
                        title="Búsquedas sin resultado"
                        value={stats.unresolved_missed_searches}
                        icon={Search}
                    />
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs,
};
