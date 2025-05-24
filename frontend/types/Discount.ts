export type DiscountType = 'FIXED_AMOUNT' | 'PERCENTAGE';

export interface Discount {
    id: string;
    code: string;
    name: string;
    description?: string;
    type: DiscountType;
    value: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    maxUsage?: number;
    currentUsage?: number;
    createdAt?: string;
}
