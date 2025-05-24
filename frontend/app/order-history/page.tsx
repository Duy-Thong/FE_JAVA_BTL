'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    Typography,
    Tag,
    Button,
    Modal,
    message,
    Timeline,
    Skeleton,
    Space,
} from 'antd';
import { EyeOutlined, CarOutlined } from '@ant-design/icons';
import Header from '../../components/Core/Header';
const { Title } = Typography;

interface Product {
    id: string;
    name: string;
    price: number;
    img_url: string;
    retailer: string;
    category: string;
}

interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    price: number;
    order: Order;
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    customerName: string;
    shippingAddress: string;
    phoneNumber: string;
    note: string;
    paymentMethod: string;
    cardNumber?: string;
    cardHolder?: string;
    user: {
        id: string;
    };
}

interface Shipment {
    id: string;
    trackingNumber: string;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    notes: string;
    shippingFee: number;
    status:
        | 'PENDING'
        | 'CONFIRMED'
        | 'PROCESSING'
        | 'SHIPPING'
        | 'DELIVERED'
        | 'CANCELLED'
        | 'RETURNED';
    createdAt: string;
    updatedAt: string;
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>(
        [],
    );
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [shipmentModalVisible, setShipmentModalVisible] = useState(false);
    const [selectedShipments, setSelectedShipments] = useState<Shipment[]>([]);
    const [shipmentLoading, setShipmentLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const userData = JSON.parse(
                localStorage.getItem('userData') || '{}',
            );
            const userId = userData.id;
            console.log('userId:', userId);

            if (!userId) {
                message.error('Vui lòng đăng nhập để xem lịch sử đơn hàng');
                return;
            }
            const response = await fetch(
                `http://localhost:8080/api/orders/user/${userId}`,
            );
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                message.error('Không thể tải danh sách đơn hàng');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách đơn hàng');
        }
        setLoading(false);
    };

    const fetchOrderItems = async (orderId: string) => {
        setModalLoading(true);
        try {
            const order = orders.find((o) => o.id === orderId);
            setSelectedOrder(order || null);

            const response = await fetch(
                `http://localhost:8080/api/orderItems/order/${orderId}`,
            );
            if (response.ok) {
                const items = await response.json();
                setSelectedOrderItems(items);
                setIsModalVisible(true);
            } else {
                message.error('Không thể tải chi tiết đơn hàng');
            }
        } catch (error) {
            console.error('Error fetching order items:', error);
            message.error('Đã xảy ra lỗi khi tải chi tiết đơn hàng');
        }
        setModalLoading(false);
    };

    const fetchShipmentDetails = async (orderId: string) => {
        setShipmentLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/shipments/order/${orderId}`,
            );
            if (response.ok) {
                const shipments = await response.json();
                setSelectedShipments(shipments);
                setShipmentModalVisible(true);
            } else {
                message.error('Không thể tải thông tin vận chuyển');
            }
        } catch (error) {
            console.error('Error fetching shipment:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin vận chuyển');
        }
        setShipmentLoading(false);
    };

    const getShipmentStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'green';
            case 'SHIPPING':
                return 'blue';
            case 'PROCESSING':
                return 'processing';
            case 'CONFIRMED':
                return 'cyan';
            case 'PENDING':
                return 'gold';
            case 'CANCELLED':
                return 'red';
            case 'RETURNED':
                return 'orange';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => id.slice(0, 8),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a: Order, b: Order) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `${amount.toLocaleString('vi-VN')}₫`,
            sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color =
                    status === 'COMPLETED'
                        ? 'green'
                        : status === 'PENDING'
                        ? 'gold'
                        : status == 'APPROVED'
                        ? 'cyan'
                        : status === 'CANCELLED'
                        ? 'red'
                        : 'blue';
                return (
                    <Tag color={color}>
                        {status === 'COMPLETED'
                            ? 'Hoàn thành'
                            : status === 'PENDING'
                            ? 'Chờ xử lý'
                            : status === 'APPROVED'
                            ? 'Đã duyệt'
                            : status === 'CANCELLED'
                            ? 'Đã hủy'
                            : status}
                    </Tag>
                );
            },
            filters: [
                { text: 'Chờ xử lý', value: 'PENDING' },
                { text: 'Hoàn thành', value: 'COMPLETED' },
                { text: 'Đã hủy', value: 'CANCELLED' },
            ],
            onFilter: (value: string, record: any) => record.status === value,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Order) => (
                <>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => fetchOrderItems(record.id)}
                        style={{ marginRight: '8px' }}
                    />
                    {record.status !== 'CANCELLED' && (
                        <Button
                            type="default"
                            icon={<CarOutlined />}
                            onClick={() => fetchShipmentDetails(record.id)}
                        />
                    )}
                </>
            ),
        },
    ];

    const orderItemColumns = [
        {
            title: 'Hình ảnh',
            dataIndex: ['product', 'img_url'],
            key: 'image',
            render: (img_url: string) => (
                <img
                    src={img_url}
                    alt="Sản phẩm"
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                    }}
                />
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: ['product', 'name'],
            key: 'productName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString('vi-VN')}₫`,
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (record: OrderItem) =>
                `${(record.price * record.quantity).toLocaleString('vi-VN')}₫`,
        },
    ];

    const pageStyle = {
        background: 'linear-gradient(to bottom, #f0f2f5, #ffffff)',
        minHeight: '100vh',
        padding: '2rem',
    };

    const cardStyle = {
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '24px',
    };

    const tableStyle = {
        '.ant-table': {
            background: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
        },
        '.ant-table-thead > tr > th': {
            background: '#f7f9fc',
        },
    };

    const buttonStyle = {
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    };

    if (loading) {
        return (
            <div style={pageStyle}>
                <div style={cardStyle} className="mx-auto max-w-7xl">
                    <Skeleton active paragraph={{ rows: 1 }} />
                    <div className="mt-4">
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />

            <div style={pageStyle}>
                <div style={cardStyle} className="mx-auto max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <Title level={2} className="!mb-0">
                            Lịch Sử Đơn Hàng
                        </Title>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={orders}
                        loading={loading}
                        rowKey="id"
                        style={tableStyle}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} orders`,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </div>

                <Modal
                    title={
                        <div className="text-xl font-semibold">
                            Chi Tiết Đơn Hàng
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={1000}
                    className="custom-modal"
                >
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                                <div>
                                    <p className="font-medium text-gray-600">
                                        Địa chỉ giao hàng
                                    </p>
                                    <p className="mt-1">
                                        {selectedOrder.shippingAddress}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-600">
                                        Ghi chú
                                    </p>
                                    <p className="mt-1">
                                        {selectedOrder.note ||
                                            'Không có ghi chú'}
                                    </p>
                                </div>
                            </div>
                            <Table
                                columns={orderItemColumns}
                                dataSource={selectedOrderItems}
                                rowKey="id"
                                loading={modalLoading}
                                pagination={false}
                                className="custom-table"
                            />
                        </div>
                    )}
                </Modal>

                <Modal
                    title={
                        <div className="text-xl font-semibold">
                            Theo Dõi Vận Chuyển
                        </div>
                    }
                    open={shipmentModalVisible}
                    onCancel={() => setShipmentModalVisible(false)}
                    footer={null}
                    width={600}
                    className="custom-modal"
                >
                    {shipmentLoading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : selectedShipments.length > 0 ? (
                        <div className="space-y-6">
                            {selectedShipments.map((shipment) => (
                                <div
                                    key={shipment.id}
                                    className="rounded-lg bg-gray-50 p-6"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Mã vận đơn
                                                </p>
                                                <p className="font-medium">
                                                    {shipment.trackingNumber}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Trạng thái
                                                </p>
                                                <Tag
                                                    color={getShipmentStatusColor(
                                                        shipment.status,
                                                    )}
                                                >
                                                    {shipment.status}
                                                </Tag>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Người nhận
                                                </p>
                                                <p className="font-medium">
                                                    {shipment.recipientName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Số điện thoại
                                                </p>
                                                <p className="font-medium">
                                                    {shipment.recipientPhone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600">
                                            Địa chỉ
                                        </p>
                                        <p className="font-medium">
                                            {shipment.shippingAddress}
                                        </p>
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>
                                                Tạo lúc:{' '}
                                                {new Date(
                                                    shipment.createdAt,
                                                ).toLocaleString()}
                                            </span>
                                            {shipment.updatedAt && (
                                                <span>
                                                    Cập nhật:{' '}
                                                    {new Date(
                                                        shipment.updatedAt,
                                                    ).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            Không có thông tin vận chuyển
                        </div>
                    )}
                </Modal>
            </div>
        </>
    );
};

export default OrderHistory;
