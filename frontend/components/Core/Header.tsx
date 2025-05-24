import React, { ChangeEventHandler, useState, useEffect, useRef } from 'react';

import Image from 'next/image';

import { useRouter } from 'next/navigation';

import { ShoppingCartOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

import {
    Breadcrumb,
    Layout,
    Menu,
    Button,
    Input,
    Typography,
    Badge,
    message,
    Form,
    Avatar,
    Dropdown,
} from 'antd';

import branch1 from '@/app/assets/images/branch1.png';

import bluecart from '@/app/assets/images/bluecart.png';
import { SearchResult } from '../search';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchProduct } from '@/hooks/useSearchProduct';
import Link from 'next/link';
import { useOnClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/hooks/useAuth';
import ptit from '@/app/assets/images/ptit.jpg';
const { Header: HeaderComponent } = Layout;

const { Search } = Input;

const Header = () => {
    const router = useRouter();
    const [isOpenSearchResult, setIsOpenSearchResult] =
        useState<boolean>(false);
    const { data: searchResults, trigger } = useSearchProduct();

    const { isLoggedIn, isValidating, mutate } = useAuth();

    const searchRef = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(searchRef, () => setIsOpenSearchResult(false));

    const searchHandler = useDebouncedCallback(
        // function
        (value: string) => {
            setIsOpenSearchResult(true);

            trigger(value);
        },
        // delay in ms
        500,
        {
            // leading: true sẽ ko bị debouce ở lần nhập đầu tiên, kể từ lần bấm thứ 2 trở đi sẽ bị debounce
            leading: true,
        },
    );

    const handleNavigation = () => {
        router.push('/cart');
    };

    const [hasUserId, setHasUserId] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userIdFromStorage = userData.id;
        if (userIdFromStorage) {
            setHasUserId(true);
        }
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData'); // Sửa từ 'userId' thành 'userData'
        mutate(null);   
        setHasUserId(false);
        setHasUserId(false);
        message.success('Log out successfully!');
    };

    return (
        <HeaderComponent className="sticky left-0 right-0 top-0 z-[999] bg-white shadow-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Left section - Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center">
                        <Image
                            src={ptit}
                            alt="PTIT Logo"
                            width={40}
                            height={40}
                            className="rounded object-contain"
                        />
                    </Link>
                </div>

                {/* Center section - Search */}
                <div className="mx-4 flex-1 justify-center lg:flex lg:max-w-2xl lg:px-4 mt-6">
                    <div ref={searchRef} className="relative w-full pt-[2px]">
                        <Search
                            className="w-full !h-[32px]"
                            placeholder="Tìm kiếm sản phẩm..."
                            onChange={(e) => searchHandler(e.target.value)}
                        />
                        {isOpenSearchResult && searchResults && (
                            <SearchResult
                                results={searchResults}
                                setIsOpenSearchResult={setIsOpenSearchResult}
                            />
                        )}
                    </div>
                </div>

                {/* Right section - User */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center text-primary">
                            <PhoneOutlined className="text-lg mr-1" />
                            <span>Đường dây nóng: 1900-1234</span>
                        </div>
                        <Button 
                            icon={<EnvironmentOutlined />}
                            onClick={() => router.push('/store-locations')}
                        >
                            Cửa hàng
                        </Button>
                    </div>
                    <div className="ml-2">
                        {!hasUserId ? (
                            <Link href="/login" scroll={false}>
                                <Button type="primary">
                                    Đăng nhập
                                </Button>
                            </Link>
                        ) : (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            label: 'Giỏ hàng',
                                            key: 'cart',
                                            icon: <ShoppingCartOutlined />,
                                            onClick: () => router.push('/cart'),
                                        },
                                        {
                                            label: 'Quản lý tài khoản',
                                            key: 'manage-account',
                                            onClick: () => router.push('/account-settings'),
                                        },
                                        {
                                            label: 'Lịch sử đặt hàng',
                                            key: 'order-history',
                                            onClick: () => router.push('/order-history'),
                                        },
                                        {
                                            label: 'Đăng xuất',
                                            key: 'logout',
                                            danger: true,
                                            onClick: logoutHandler,
                                        },
                                    ],
                                }}
                                trigger={['click']}
                            >
                                <Avatar className="cursor-pointer bg-primary" icon={<UserOutlined />} />
                            </Dropdown>
                        )}

                    </div>
                </div>
            </div>
        </HeaderComponent>
    );
};

export default Header;

