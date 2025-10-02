export type Event = {
    client_id: string
    created_at: string | null
    distance_km: number | null
    duration_hours: number
    estimated_total_drinks: number | null
    event_date: string
    gross_profit: number | null
    id: string
    location: string
    num_guests: number
    profit_margin_percentage: number
    public_rating: number | null
    total_investment: number | null
    updated_at: string | null
    user_id: string | null
};

export type EventAdditionalCost = {
    created_at: string | null
    description: string
    event_id: string
    id: string
    quantity: number
    total_cost: number | null
    unit: string | null
    unit_cost: number
    updated_at: string | null
}

export type EventServedDrinks = {
    created_at: string | null
    drink_id: string
    event_id: string
    id: string
    served_quantity: number
    total_cost_at_event: number | null
    unit_cost_at_event: number | null
    updated_at: string | null
}

