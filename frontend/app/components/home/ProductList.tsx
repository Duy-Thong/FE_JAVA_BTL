'use client';
import React from 'react';
import { Card } from 'antd';
const { Meta } = Card;

const ProductList: React.FC<{ productData: any[] }> = ({ productData }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {productData.map((product) => (
                <Card
                    key={product.id}
                    hoverable
                    className="w-full max-w-[180px]"
                    cover={
                        <img
                            alt={product.name}
                            src={product.image}
                            className="h-[120px] object-cover"
                        />
                    }
                >
                    <Meta
                        title={<div className="text-sm">{product.name}</div>}
                        description={<div className="text-xs">${product.price}</div>}
                    />
                </Card>
            ))}
        </div>
    );
};

export default ProductList;
