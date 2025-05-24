import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Table, Popconfirm, Button, Tag } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

import DeleteProductButton from './DeleteProductButton';
import UpdateProductDrawer from './UpdateProductDrawer';
import {
    ProductManagerProps,
    ProductProps,
} from '../../../interfaces/ProductInterfaces';

const ProductManager: React.FC<ProductManagerProps> = ({ productsData }) => {
    const productDataWithKey = productsData.map((obj) => {
        // Create a new object with the "key" field set to the value of the "id" field
        return { ...obj, key: obj.id };
    });
    const columns: ColumnsType<ProductProps> = [
        {
            title: 'Hình ảnh',
            dataIndex: 'img_url',
            render: (img_url: string | null) => (
                <Image
                    //@ts-ignore
                    src={img_url}
                    alt="Sản phẩm"
                    width={100}
                    height={100}
                    unoptimized={true}
                />
            ),
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'id',
            key: 'id',
            sorter: (a: ProductProps, b: ProductProps) => a.id.localeCompare(b.id),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: ProductProps, b: ProductProps) => a.name.localeCompare(b.name),
            filterSearch: true,
            filters: [
                ...new Set(productsData.map(item => item.name))
            ].map(name => ({ text: name, value: name })),
            onFilter: (value: React.Key | boolean, record: ProductProps) => record.name === value,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            filters: [
                {
                    text: 'Máy tính bảng',
                    value: 'tablet',
                },
                {
                    text: 'Laptop',
                    value: 'laptop',
                },
                {
                    text: 'Điện thoại',
                    value: 'mobile',
                },
                {
                    text: 'Sách',
                    value: 'book',
                },
                {
                    text: 'Quần áo',
                    value: 'clothing',
                },
            ],
            onFilter: (value: React.Key | boolean, record: ProductProps) =>
                record.category === value,
            filterSearch: true,
            render: (category: string | null) =>
                category === 'tablet' ? (
                    <Tag color="pink">Máy tính bảng</Tag>
                ) : category === 'mobile' ? (
                    <Tag color="purple">Điện thoại</Tag>
                ) : category === 'laptop' ? (
                    <Tag color="orange">Laptop</Tag>
                ) : category === 'book' ? (
                    <Tag color="blue">Sách</Tag>
                ) : category === 'clothing'?(
                    <Tag color="green">Quần áo</Tag>
                ) : (
                    <Tag color="red">Khác</Tag>
                ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: (a: ProductProps, b: ProductProps) => parseInt(a.price) - parseInt(b.price),
            filters: [
                { text: 'Dưới 5 triệu', value: '0-5000000' },
                { text: '5-10 triệu', value: '5000000-10000000' },
                { text: '10-20 triệu', value: '10000000-20000000' },
                { text: 'Trên 20 triệu', value: '20000000-999999999' },
            ],
            onFilter: (value: React.Key | boolean, record: ProductProps) => {
                const [min, max] = (value as string).split('-').map(Number);
                const price = parseInt(record.price);
                return price >= min && price <= max;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (prod: ProductProps) => (
                <div>
                    <UpdateProductDrawer productData={prod} />
                    <DeleteProductButton productData={prod} />
                </div>
            ),
        },
    ];

    const handleDelete = (ProductId: string) => {
        console.log('Xóa sản phẩm có ID: ', ProductId);
    };

    const onChange: TableProps<ProductProps>['onChange'] = (
        pagination,
        filters,
        sorter,
        extra,
    ) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className="min-h-screen text-black">
            <Table
                columns={columns}
                onChange={onChange}
                dataSource={productDataWithKey}
                bordered
            />
        </div>
    );
};

export default ProductManager;
