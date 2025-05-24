import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import useSWRMutation from 'swr/mutation';
import { ProductProps } from '@/interfaces/ProductInterfaces';

export function useSearchProduct() {
    const [productArray, setProductArray] = useState([]);

    useEffect(() => {
        const apiUrl = 'http://localhost:8080/api/product';

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Assuming the response contains JSON data
            })
            .then((data) => {
                setProductArray(data);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }, []);
    // A useSWR + mutate like API, but it will not start the request automatically.
    return useSWRMutation('/search_product', (_, { arg }: { arg: string }) => {
        if (!arg) return [];

        const filtersSearchValue = productArray.filter(
            (product: ProductProps) => {
                const { name } = product;

                return name.toLowerCase().includes(arg);
            },
        );

        return filtersSearchValue;
    });
}
