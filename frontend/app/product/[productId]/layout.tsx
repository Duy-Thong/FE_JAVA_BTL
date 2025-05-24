'use client';

import { ReactNode } from 'react';
import { Layout } from 'antd';
import Header from '@/components/Core/Header';
import Footer from '@/components/Core/Footer';

const { Content } = Layout;

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <Layout className="min-h-screen">
            <Header />
            <Content className="flex-1 w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
                <div className="bg-white rounded-lg shadow-sm">
                    {children}
                </div>
            </Content>
        </Layout>
    );
}
