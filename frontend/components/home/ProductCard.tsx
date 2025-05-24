'use client';
import React from 'react';
import { EllipsisOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Card, Typography, Badge, Tag, Space } from 'antd';
import { useRouter } from 'next/navigation';

const { Text, Title } = Typography;
const { Meta } = Card;

const formatPrice = (price: string | number): string => {
    if (!price) return '0 ₫';
    
    // Convert price to string if it's a number
    const priceString = typeof price === 'number' ? price.toString() : price;
    
    // Remove all non-numeric characters except dots and commas
    const cleanPrice = priceString.replace(/[^\d.,]/g, '');
    // Convert to number, handling different number formats
    const numericPrice = parseFloat(cleanPrice.replace(/,/g, ''));
    
    // Format the price with Vietnamese locale
    return numericPrice.toLocaleString('vi-VN') + ' ₫';
};

interface ProductCardProps {
    data: {
        id: string;
        retailer: string;
        img_url: string;
        name: string;
        price: string;
        url: string;
        category: string;
        discountValue?: number;
        discountType?: 'FIXED_AMOUNT' | 'PERCENTAGE';
        discountCode?: string;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const router = useRouter();
    const SALE_BADGE = "SALE 10%";
    
    // Update price calculation to handle both string and number types
    const actualPrice = typeof data.price === 'string' 
        ? parseFloat(data.price.replace(/[^\d.,]/g, ''))
        : parseFloat(data.price);
    const originalPrice = actualPrice * 1.1;

    const calculateDiscountedPrice = () => {
        const originalPrice = parseFloat(data.price.replace(/[^0-9.-]+/g, '')) || 0;
        if (!data.discountValue) return originalPrice;
        
        if (data.discountType === 'FIXED_AMOUNT') {
            return originalPrice - data.discountValue;
        } else if (data.discountType === 'PERCENTAGE') {
            return originalPrice * (1 - data.discountValue / 100);
        }
        return originalPrice;
    };

    return (
        <div className="relative">
            {/* Custom Badge instead of Badge.Ribbon */}
            <div className="
                absolute -top-1 -right-1 z-10
                bg-gradient-to-r from-blue-400 to-blue-500
                text-white text-sm font-medium
                px-3 py-1.5
                rounded-bl-xl rounded-tr-xl
                shadow-md
                transform rotate-0
                transition-transform duration-300
                hover:scale-105
                flex items-center gap-1
            ">
                <span className="animate-pulse">🔥</span>
                SALE 10%
            </div>
            <Card
                hoverable
                className="
                    h-full rounded-xl overflow-hidden
                    bg-gradient-to-br from-white to-blue-50
                    hover:shadow-lg hover:-translate-y-1
                    transition-all duration-300 ease-in-out
                    border border-blue-100
                "
                onClick={() => router.push(`/product/${data.id}`)}
                cover={
                    <div className="
                        h-48 overflow-hidden relative
                        flex justify-center items-center
                        bg-gradient-to-t from-blue-50 to-white
                        p-4
                    ">
                        <img
                            alt={data.name}
                            src={data.img_url}
                            className="
                                w-full h-full object-contain
                                transition-transform duration-300 ease-in-out
                                hover:scale-110
                            "
                        />
                    </div>
                }
                actions={[
                    <HeartOutlined key="heart" className="text-blue-400 text-lg hover:text-blue-600 transition-colors" />,
                    <ShoppingCartOutlined key="cart" 
                        className="text-blue-400 text-lg hover:text-blue-600 transition-colors"
                        onClick={() => router.push(`/product/${data.id}`)} 
                    />
                ]}
            >
                <Meta
                    title={
                        <Text
                            className="text-lg font-semibold text-gray-800 line-clamp-2"
                        >
                            {data.name}
                        </Text>
                    }
                    description={
                        <Space direction="vertical" size={4} className="w-full">
                            {data.discountValue && data.discountCode && (
                                <Tag 
                                    className="
                                        mb-2 bg-gradient-to-r from-blue-500 to-blue-400 
                                        text-white border-none px-3 py-1
                                    "
                                >
                                    Giảm {data.discountType === 'PERCENTAGE' ? 
                                        `${data.discountValue}%` : 
                                        `${data.discountValue.toLocaleString()}đ`
                                    }
                                </Tag>
                            )}
                            <div className="mt-2">
                                {data.discountValue ? (
                                    <div className="space-y-1">
                                        <Text delete type="secondary" className="text-sm">
                                            {formatPrice(originalPrice)}
                                        </Text>
                                        <Title 
                                            level={4} 
                                            className="!m-0 !text-blue-500 font-bold"
                                        >
                                            {formatPrice(calculateDiscountedPrice())}
                                        </Title>
                                    </div>
                                ) : (
                                    <Title 
                                        level={4} 
                                        className="!m-0 !text-blue-500 font-bold"
                                    >
                                        {formatPrice(data.price)}
                                    </Title>
                                )}
                            </div>
                        </Space>
                    }
                />
            </Card>
        </div>
    );
};

export default ProductCard;
