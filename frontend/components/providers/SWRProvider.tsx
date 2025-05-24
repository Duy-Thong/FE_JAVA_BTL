'use client';

import { SWRConfig } from 'swr';

/**
 * Ref: https://swr.vercel.app/docs/global-configuration
 *
 * Tạo context provider cho swr để áp dụng instance cho tất cả các hook cua swr bên trong provider
 */

const SWRProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SWRConfig
            value={{
                /**
                 * polling when the window is invisible (if `refreshInterval` is enabled)
                 * @defaultValue false
                 *
                 */
                refreshWhenHidden: false,
                /**
                 * polling when the browser is offline (determined by `navigator.onLine`)
                 */
                refreshWhenOffline: false,
                /**
                 * automatically revalidate when window gets focused
                 * @defaultValue true
                 * @link https://swr.vercel.app/docs/revalidation
                 */
                revalidateOnFocus: false,
                /**
                 * automatically revalidate when the browser regains a network connection (via `navigator.onLine`)
                 * @defaultValue true
                 * @link https://swr.vercel.app/docs/revalidation
                 */
                revalidateOnReconnect: false,
                /**
                 * enable or disable automatic revalidation when component is mounted
                 */
                revalidateOnMount: false,
                /**
                 * automatically revalidate even if there is stale data
                 * @defaultValue true
                 * @link https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
                 */
                revalidateIfStale: true,
                /**
                 * retry when fetcher has an error
                 * @defaultValue true
                 */
                shouldRetryOnError: false,
            }}
        >
            {children}
        </SWRConfig>
    );
};

export default SWRProvider;
