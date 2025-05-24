import useSWR from 'swr';
import { axiosInstance } from '@/libs/fetcher';

const DEFAULT_USER_ID = 'a08f9e729dd84ea9b6606cb4dfabd97a';

export const useOrderHistory = () => {
    const { data, error, isLoading } = useSWR(
        `/api/orders/user/${DEFAULT_USER_ID}`,
        async (url) => {
            const response = await axiosInstance.get(url);
            return response.data;
        }
    );

    return {
        data,
        isLoading,
        isError: error
    };
};
