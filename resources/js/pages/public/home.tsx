import { Head, usePage } from '@inertiajs/react';
import CategoryGrid from '@/components/public/category-grid';
import HeroSearch from '@/components/public/hero-search';
import RecentGuides from '@/components/public/recent-guides';
import PublicLayout from '@/layouts/public/layout';
import type { Category, Guide } from '@/types/tramites';

type PageProps = {
    categories: Category[];
    recentGuides: Guide[];
};

export default function Home() {
    const { categories, recentGuides } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <Head title="Información práctica para hacer trámites en Cajamarca" />

            <HeroSearch categories={categories} />
            <CategoryGrid categories={categories} />
            <RecentGuides guides={recentGuides} />
        </PublicLayout>
    );
}
