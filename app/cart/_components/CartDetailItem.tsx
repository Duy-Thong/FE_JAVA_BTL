'use client';

import { Button, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import axios from 'axios';

import ghn from '../../assets/images/ghn.png';
import { Product } from '@/types/product';
import { concurrencyFormat } from '@/utils/concurrency-format';

const MAX_QUANTITY = 999;
const MIN_QUANTITY = 1;

export interface CartProps extends Product {
    quantity: number;
}

interface CartDetailItemProps {
    cart: {
        id: string;
        retailer: string;
        img_url: string;
        name: string;
        price: number;
        url: string;
        category: string;
        quantity: number;
    };
    onRemove: (id: string) => Promise<void>;
    onQuantityChange: (qty: number, id: string) => void;
}

const CartDetailItem: React.FC<CartDetailItemProps> = ({
    cart,
    onRemove,
    onQuantityChange,
}) => {
    const handleIncrement = () => {
        if (cart.quantity < MAX_QUANTITY) {
            const newQuantity = cart.quantity + 1;
            onQuantityChange(newQuantity, cart.id);
        }
    };

    const handleDecrement = () => {
        if (cart.quantity > MIN_QUANTITY) {
            const newQuantity = cart.quantity - 1;
            onQuantityChange(newQuantity, cart.id);
        }
    };

    const handleRemove = () => {
        onRemove(cart.id);
    };

    return (
        <div className="flex items-center border-b p-3">
            <div className="h-16 w-16 flex-shrink-0">
                <img
                    src={cart.img_url}
                    alt={cart.name}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="ml-3 flex flex-1 flex-col gap-1">
                <Link 
                    href={`/product/${cart.id}`} 
                    className="line-clamp-2 text-sm font-medium"
                >
                    {cart.name}
                </Link>
                <div className="text-sm text-red-500">
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(cart.price)}
                    <span className="inline-block ml-2 line-through text-gray-400 text-xs">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(cart.price * 1.1)}
                    </span>
                    <span className="inline-block ml-2 bg-red-100 text-red-600 text-xs px-1 rounded">
                        -10%
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded">
                        <Button 
                            type="text" 
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={handleDecrement}
                            disabled={cart.quantity <= MIN_QUANTITY}
                        />
                        <span className="px-2 min-w-[40px] text-center">{cart.quantity}</span>
                        <Button 
                            type="text" 
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={handleIncrement}
                            disabled={cart.quantity >= MAX_QUANTITY}
                        />
                    </div>
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleRemove}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartDetailItem;
