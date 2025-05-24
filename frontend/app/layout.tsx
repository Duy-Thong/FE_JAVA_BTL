import type { Metadata } from 'next';
// import Header from '../components/Core/Header';
// import Footer from '../components/Core/Footer';
// These styles apply to every route in the application
import '../styles/globals.css';
import StyledComponentsRegistry from '@/lib/app-registry/antd';
import GlobalLayout from '../components/layout';
import SWRProvider from '@/components/providers/SWRProvider';
import { PropsWithChildren, ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'PTIT Store',
    description: 'PTIT Store - Thiên đường mua sắm trực tuyến',
};

type ModalRoute = {
    modal: ReactNode;
};

export default function RootLayout({
    children,
    modal,
}: PropsWithChildren<ModalRoute>) {
    return (
        <html lang="en" suppressHydrationWarning dir="ltr">
            <body>
                <StyledComponentsRegistry>
                    <SWRProvider>
                        <GlobalLayout>
                            {children}
                            {modal}
                        </GlobalLayout>
                    </SWRProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
