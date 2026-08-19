import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    HelpCircle,
    LayoutGrid,
    Search,
    Tags,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/admin';
import { index as categoriesIndex } from '@/routes/admin/categories';
import { index as correctionsIndex } from '@/routes/admin/corrections';
import { index as guidesIndex } from '@/routes/admin/guides';
import { index as missedSearchesIndex } from '@/routes/admin/missed-searches';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Trámites',
        href: guidesIndex(),
        icon: BookOpen,
    },
    {
        title: 'Categorías',
        href: categoriesIndex(),
        icon: Tags,
    },
    {
        title: 'Correcciones',
        href: correctionsIndex(),
        icon: HelpCircle,
    },
    {
        title: 'Búsquedas sin resultado',
        href: missedSearchesIndex(),
        icon: Search,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repositorio',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
