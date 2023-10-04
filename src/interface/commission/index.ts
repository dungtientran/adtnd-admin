export interface CommissionRate {
    id: string;
    subscription_product_id: string;
    type: string;
    fila_commission_rate: number;
    sale_commission_rate: number;
    manager_commision_rate: number;
    director_commission_rate: number;
    profit_from: number;
    profit_to: number;
}

export interface Commission {
    id: string;
    sale_id: string;
    transaction_id: string;
    amount: 24150;
    description: string;
    payment_history: null;
    status: string;
    created_at: string;
    updated_at: string;
}
