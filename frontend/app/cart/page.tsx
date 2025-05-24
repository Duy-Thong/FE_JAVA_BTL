'use client';

import { useEffect, useMemo, useState } from 'react';
import CartDetailItem from './_components/CartDetailItem';
import {
    Button,
    Modal,
    Form,
    Input,
    notification,
    Spin,
    Card,
    List,
    Skeleton,
    Typography,
    Space,
    Divider,
} from 'antd';
import {
    ShoppingCartOutlined,
    DeleteOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Header from '@/components/Core/Header';

// ...existing interfaces...

interface OrderData {
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    originalAmount: number;
    discountAmount: number;
    totalAmount: number;
    phoneNumber: string;
    shippingAddress: string;
    customerName: string;
    note?: string;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    img_url: string;
    quantity: number;
}

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
    // ...existing state and hooks...

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [cartId, setCartId] = useState<string | null>(null);

    const getCartId = async (userId: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/cart/user/${userId}`,
                {
                    credentials: 'include',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const cartData = await response.json();
            console.log('cartData: ', cartData);
            // cartData is now a Cart object with id property
            return cartData.id;
        } catch (error) {
            console.error('Error fetching cart:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                // Kiểm tra token trước
                const token = localStorage.getItem('token');
                if (!token) {
                    notification.error({
                        message: 'Chưa đăng nhập',
                        description: 'Vui lòng đăng nhập để xem giỏ hàng',
                    });
                    router.push('/login');
                    return;
                }

                // Lấy userData sau khi đã verify token
                const userData = JSON.parse(
                    localStorage.getItem('userData') || '{}',
                );
                if (!userData.id) {
                    // Nếu không có userData nhưng có token, thử fetch lại thông tin user
                    try {
                        const userResponse = await fetch(
                            'http://localhost:8080/api/user/profile',
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                credentials: 'include',
                            },
                        );
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            localStorage.setItem(
                                'userData',
                                JSON.stringify(userData),
                            );
                        } else {
                            // Nếu không lấy được thông tin user, xóa token và redirect
                            localStorage.removeItem('token');
                            router.push('/login');
                            return;
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                        router.push('/login');
                        return;
                    }
                }

                // Tiếp tục với logic fetching cart như cũ
                const cartId = await getCartId(userData.id);
                localStorage.setItem('cartId', cartId);
                if (!cartId) {
                    setIsLoading(false);
                    return;
                }

                setCartId(cartId);

                const response = await fetch(
                    `http://localhost:8080/api/cartitems/${cartId}`,
                    {
                        credentials: 'include',
                    },
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                setCartItems(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching cart data:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải thông tin giỏ hàng',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [router]);

    const groupedCartItems = useMemo(() => {
        const grouped = cartItems.reduce(
            (acc, item) => {
                const key = item.id;
                if (!acc[key]) {
                    acc[key] = {
                        ...item,
                        quantity: 1,
                    };
                } else {
                    acc[key].quantity += 1;
                }
                return acc;
            },
            {} as Record<string, CartItem & { quantity: number }>,
        );

        return Object.values(grouped);
    }, [cartItems]);

    const calcTotalPrice = useMemo(() => {
        return groupedCartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
    }, [groupedCartItems]);

    const calcDiscountAmount = useMemo(() => {
        return 0; // Không giảm giá thêm vì sản phẩm đã được giảm giá từ trang chi tiết
    }, [calcTotalPrice]);

    const calcFinalPrice = useMemo(() => {
        return calcTotalPrice - calcDiscountAmount;
    }, [calcTotalPrice, calcDiscountAmount]);

    const calcTotalQuantity = useMemo(() => {
        return groupedCartItems.reduce(
            (total, item) => total + item.quantity,
            0,
        );
    }, [groupedCartItems]);

    const removeHandler = async (id: string) => {
        try {
            if (!cartId) return;

            const response = await fetch(
                `http://localhost:8080/api/cartitems/delete/${cartId}/${id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to delete cart item');
            }
            const filteredCart = cartItems.filter((x) => x.id !== id);
            setCartItems(filteredCart);
        } catch (error) {
            console.error('Error deleting cart item:', error);
        }
    };

    const handleQuantityChange = (newQuantity: number, itemId: string) => {
        setCartItems((prevItems) => {
            const targetItem = prevItems.find((item) => item.id === itemId);
            if (!targetItem) return prevItems;

            // Remove all instances of this item
            const filteredItems = prevItems.filter(
                (item) => item.id !== itemId,
            );

            // Add back the correct number of instances
            const newItems = [...filteredItems];
            for (let i = 0; i < newQuantity; i++) {
                newItems.push({ ...targetItem });
            }

            return newItems;
        });
    };

    const checkoutHandler = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            setIsSubmitting(true);
            const values = await form.validateFields();

            const orderData: OrderData = {
                items: groupedCartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                originalAmount: calcTotalPrice,
                discountAmount: 0, // Không giảm giá thêm
                totalAmount: calcTotalPrice,
                phoneNumber: values.phone,
                shippingAddress: values.address,
                customerName: values.fullName,
                note: values.note,
            };

            // Clear the cart before redirecting
            if (cartId) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/api/cart/${cartId}/clear`,
                        {
                            method: 'DELETE',
                            credentials: 'include',
                        }
                    );
                    if (!response.ok) {
                        console.error('Failed to clear cart');
                    }
                } catch (error) {
                    console.error('Error clearing cart:', error);
                }
            }

            localStorage.setItem('pendingOrder', JSON.stringify(orderData));
            router.push('/payment');
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <Card className="mb-4">
                            <Skeleton active />
                        </Card>
                        <Card>
                            <Skeleton active />
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    if (!cartItems.length) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <Card className="text-center">
                            <ShoppingCartOutlined className="mb-4 text-6xl text-gray-300" />
                            <Title level={3}>Giỏ hàng trống</Title>
                            <Text className="mb-6 block text-gray-500">
                                Hãy thêm sản phẩm vào giỏ hàng của bạn
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingOutlined />}
                                onClick={() => router.push('/')}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-4">
                    <Space direction="vertical" className="mb-6 w-full">
                        <Title level={2}>Giỏ hàng</Title>
                        <Text className="text-gray-500">
                            Trang chủ / Giỏ hàng
                        </Text>
                    </Space>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-6">
                        <div className="lg:col-span-8">
                            <Card className="mb-4 lg:mb-0">
                                <List
                                    header={
                                        <div className="flex items-center justify-between">
                                            <Title level={4} className="mb-0">
                                                Sản phẩm ({calcTotalQuantity})
                                            </Title>
                                        </div>
                                    }
                                    dataSource={groupedCartItems}
                                    renderItem={(item) => (
                                        <List.Item
                                            key={item.id}
                                            className="!border-b last:!border-b-0"
                                        >
                                            <CartDetailItem
                                                cart={item}
                                                onRemove={removeHandler}
                                                onQuantityChange={(qty) =>
                                                    handleQuantityChange(
                                                        qty,
                                                        item.id,
                                                    )
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>

                        <div className="lg:col-span-4">
                            <Card className="sticky top-4">
                                <Title level={4}>Thông tin đơn hàng</Title>
                                <Space
                                    direction="vertical"
                                    className="w-full"
                                    size="large"
                                >
                                    <div className="flex items-center justify-between">
                                        <Text>Tạm tính</Text>
                                        <Text strong>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(calcTotalPrice)}
                                        </Text>
                                    </div>
                                    <div className="flex items-center justify-between text-red-500">
                                        <Text>Đã giảm giá (10%)</Text>
                                        <Text strong>
                                            Đã áp dụng
                                        </Text>
                                    </div>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div className="flex items-center justify-between">
                                        <Text strong>Tổng tiền</Text>
                                        <Text className="text-xl font-bold text-red-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(calcFinalPrice)}
                                        </Text>
                                    </div>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        onClick={checkoutHandler}
                                        className="mt-4"
                                    >
                                        Tiến hành thanh toán
                                    </Button>
                                </Space>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={
                    <Title level={4} className="mb-0">
                        Thông tin giao hàng
                    </Title>
                }
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Tiếp tục thanh toán"
                cancelText="Hủy"
                width={600}
                confirmLoading={isSubmitting}
                className="checkout-modal"
            >
                <Spin spinning={isSubmitting}>
                    <Card className="mb-4">
                        <Title level={5}>Danh sách sản phẩm</Title>
                        <List
                            className="max-h-48 overflow-auto"
                            dataSource={groupedCartItems}
                            renderItem={(item) => (
                                <List.Item key={item.id}>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.img_url}
                                            alt={item.name}
                                            className="h-16 w-16 rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <Text strong>{item.name}</Text>
                                            <div className="text-sm text-gray-500">
                                                Số lượng: {item.quantity}
                                            </div>
                                            <div className="text-sm font-semibold text-blue-600">
                                                {new Intl.NumberFormat(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    },
                                                ).format(
                                                    item.price * item.quantity,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Divider />
                        <div className="text-right">
                            <Text strong className="text-lg text-red-600">
                                Tổng:{' '}
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(calcFinalPrice)}
                            </Text>
                        </div>
                    </Card>

                    <Form form={form} layout="vertical" className="mt-4">
                        <Title level={5}>Thông tin giao hàng</Title>
                        <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên',
                                },
                                {
                                    min: 3,
                                    message: 'Họ tên phải có ít nhất 3 ký tự',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                },
                                {
                                    pattern: /^[0-9]{10}$/,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ',
                                },
                                {
                                    min: 10,
                                    message: 'Địa chỉ phải có ít nhất 10 ký tự',
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Nhập địa chỉ đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                            />
                        </Form.Item>
                        <Form.Item name="note" label="Ghi chú">
                            <Input.TextArea
                                rows={2}
                                placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};

export default CartPage;
