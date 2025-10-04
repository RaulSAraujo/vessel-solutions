export type Clients = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    name: string;
    phone: string;
    email: string;
    tax_id: string;
    address: string;
    city: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormClient = {
    address?: string | null
    city?: string | null
    created_at?: string | null
    email?: string | null
    id?: string
    name: string
    phone?: string | null
    tax_id?: string | null
    updated_at?: string | null
    user_id?: string | null
}