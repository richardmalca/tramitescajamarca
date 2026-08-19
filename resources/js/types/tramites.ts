export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    order: number;
    guides_count?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
};

export type GuideStatus = 'draft' | 'published';

export type Guide = {
    id: number;
    category_id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    cost: string | null;
    where_to_go: string | null;
    requirements: string[] | null;
    source_url: string | null;
    status: GuideStatus;
    published_at: string | null;
    category?: Pick<Category, 'id' | 'name' | 'slug'>;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
};

export type CorrectionStatus = 'pending' | 'applied' | 'dismissed';

export type Correction = {
    id: number;
    guide_id: number;
    name: string | null;
    email: string | null;
    message: string;
    status: CorrectionStatus;
    guide?: Pick<Guide, 'id' | 'title' | 'slug'>;
    created_at?: string;
    [key: string]: unknown;
};

export type MissedSearch = {
    id: number;
    query: string;
    occurrences: number;
    resolved_at: string | null;
    created_at?: string;
    [key: string]: unknown;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export type DashboardStats = {
    published_guides: number;
    draft_guides: number;
    pending_corrections: number;
    unresolved_missed_searches: number;
};
