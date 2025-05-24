'use client';

import { ReactNode } from 'react';
import { Layout } from 'antd';
import Header from '@/components/Core/Header';
const { Content } = Layout;

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <Layout className="min-h-screen">
            <Header />
            <Content className="bg-gradient-to-b from-gray-50 to-white px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-[1440px]">{children}</div>
            </Content>
        </Layout>
    );
}
