import { useState, useEffect } from 'react';

interface Discount {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'FIXED_AMOUNT' | 'PERCENTAGE';
  value: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxUsage: number;
  currentUsage: number;
  createdAt: string;
}

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('/api/discounts');
        if (!response.ok) throw new Error('Failed to fetch discounts');
        const data = await response.json();
        
        // Filter active discounts
        const activeDiscounts = data.filter((discount: Discount) => discount.isActive);
        
        // Remove duplicates by keeping only the first occurrence of each discount ID
        const uniqueIds = new Set<string>();
        const uniqueDiscounts = activeDiscounts.filter((discount: Discount) => {
          if (uniqueIds.has(discount.id)) {
            return false;
          }
          uniqueIds.add(discount.id);
          return true;
        });
        
        setDiscounts(uniqueDiscounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  return { discounts, loading, error };
};
