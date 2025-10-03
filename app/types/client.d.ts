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
    limit: number;
    totalRows: number;
    totalPages: number;
}