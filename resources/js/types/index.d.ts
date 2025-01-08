export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles: Role[]
}

export interface Category {
    id: number;
    title: string;
    slug: string;
    image?: string
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
}
export interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    image?: string;
    category: Category;
    category_id: number;
    user?: User;
    created_at: string;
}

export interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    path: string;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export interface Comment {
    id: number;
    content: string;
    created_at: string;
    article_id: number;
    user_id: number;
    parent_id: number | null;
    user?: User;
    replies?: Comment[]
}

export interface Notifications {
    id: string;
    type: string;
    data: {
        article_title: string;
        message: string;
    }
    created_at: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
