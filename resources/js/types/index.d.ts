export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles:Role[]
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
    id:number;
    title:string;
    slug:string;
    content:string;
    image?:string;
    category:Category
    user?:User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
