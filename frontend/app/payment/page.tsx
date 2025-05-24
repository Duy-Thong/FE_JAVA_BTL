'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, notification, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import Header from '@/components/Core/Header';
import emailjs from '@emailjs/browser';

const PaymentPage = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [orderData, setOrderData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedDiscountCode, setAppliedDiscountCode] = useState<
        string | null
    >(null);

    useEffect(() => {
        const savedOrder = localStorage.getItem('pendingOrder');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userIdFromStorage = userData.id;

        if (!savedOrder) {
            router.push('/cart');
            return;
        }
        if (!userIdFromStorage) {
            router.push('/login');
            return;
        }

        setUserId(userIdFromStorage);
        setOrderData(JSON.parse(savedOrder));
    }, [router]);

    const sendOrderNotificationToAdmin = async (orderData: any) => {
        try {
            const templateParams = {
                order_number: orderData.orderId,
                order_total: new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(orderData.totalAmount),
                customer_name: orderData.customerName || 'Khách hàng',
                shipping_address: orderData.shippingAddress,
                phone_number: orderData.phoneNumber,
                payment_method:
                    orderData.paymentMethod === 'COD'
                        ? 'Thanh toán khi nhận hàng'
                        : 'Thanh toán thẻ',
                order_items: orderData.orderItems
                    .map(
                        (item: any) =>
                            `${item.productId} - SL: ${
                                item.quantity
                            } - Giá: ${new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(item.price)}`,
                    )
                    .join('\n'),
            };

            const result = await emailjs.send(
                'service_zbhd07p',
                'template_r6aj2sh',
                templateParams,
                'GMDxfdGqL-yu58YOF',
            );

            console.log('Admin notification email sent successfully:', result);
        } catch (error) {
            console.error('Error sending admin notification:', error);
        }
    };

    const createShipment = async (orderId: string, orderData: any) => {
        try {
            const shipmentPayload = {
                trackingNumber: `SHIP-${Date.now()}`,
                recipientName: orderData.customerName,
                recipientPhone: orderData.phoneNumber,
                shippingAddress: orderData.shippingAddress,
                notes: orderData.note || '',
                shippingFee: 0,
                status: 'PENDING',
                order: { id: orderId },
            };

            const response = await fetch(
                'http://localhost:8080/api/shipments',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(shipmentPayload),
                },
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Shipment creation failed: ${errorData}`);
            }

            const data = await response.json();
            if (!data) {
                throw new Error('No data received from shipment creation');
            }

            return data;
        } catch (error) {
            console.error('Shipment creation error:', error);
            throw new Error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create shipment',
            );
        }
    };

    // Update clearCart function to properly handle the response
    const clearCart = async (cartId: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/cart/${cartId}/clear`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to clear cart');
            }

            // Clear local cart data if needed
            localStorage.removeItem('cartItems');
        } catch (error) {
            console.error('Error clearing cart:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to clear cart items',
            });
        }
    };

    const getDiscount = async (code: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/client/discounts/validate?code=${encodeURIComponent(
                    code,
                )}&orderAmount=${orderData.totalAmount}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                },
            );

            if (!response.ok) {
                throw new Error('Mã giảm giá không hợp lệ');
            }

            const discount = await response.json();

            // Handle invalid discount response from new API
            if (discount.valid === false) {
                throw new Error(discount.message || 'Mã giảm giá không hợp lệ');
            }

            // Calculate discount amount based on discount type
            const discountAmount =
                discount.type === 'PERCENTAGE'
                    ? (orderData.totalAmount * discount.value) / 100
                    : discount.value;

            // Apply max discount amount if specified
            return discount.maxDiscountAmount &&
                discountAmount > discount.maxDiscountAmount
                ? discount.maxDiscountAmount
                : discountAmount;
        } catch (error) {
            console.error('Error getting discount:', error);
            throw error;
        }
    };

    const handleApplyDiscount = async (code: string) => {
        if (!code) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng nhập mã giảm giá',
            });
            return;
        }

        try {
            const discountValue = await getDiscount(code);
            setDiscountAmount(discountValue);
            setAppliedDiscountCode(code);
            notification.success({
                message: 'Thành công',
                description: `Đã áp dụng mã giảm giá: ${new Intl.NumberFormat(
                    'vi-VN',
                    {
                        style: 'currency',
                        currency: 'VND',
                    },
                ).format(discountValue)}`,
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Không thể áp dụng mã giảm giá',
            });
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setIsSubmitting(true);

            const orderPayload = {
                totalAmount: orderData.totalAmount,
                shippingAddress: orderData.shippingAddress,
                phoneNumber: orderData.phoneNumber,
                customerName: orderData.customerName,
                note: orderData.note,
                paymentMethod: values.paymentMethod,
                cardNumber:
                    values.paymentMethod === 'CARD' ? values.cardNumber : null,
                cardHolder:
                    values.paymentMethod === 'CARD' ? values.cardHolder : null,
                status: 'PENDING',
                user: { id: userId }, // Add user information
                discountCode: appliedDiscountCode,
                discountAmount: discountAmount,
                finalAmount: orderData.totalAmount - discountAmount,
            };

            const orderResponse = await fetch(
                'http://localhost:8080/api/orders/create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(orderPayload),
                },
            );

            const orderResponseData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(
                    orderResponseData.message || 'Failed to create order',
                );
            }

            // Update discount usage if a discount code was applied
            if (appliedDiscountCode) {
                try {
                    const discountUpdateResponse = await fetch(
                        `http://localhost:8080/api/discounts/use/${appliedDiscountCode}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        }
                    );
                    
                    if (!discountUpdateResponse.ok) {
                        console.error('Failed to update discount usage');
                    }
                } catch (discountError) {
                    console.error('Error updating discount usage:', discountError);
                    // Continue with order process even if discount update fails
                }
            }

            let shipmentResult;
            try {
                shipmentResult = await createShipment(
                    orderResponseData.id,
                    orderData,
                );
                console.log('Shipment created:', shipmentResult);
            } catch (shipmentError) {
                console.error('Shipment creation failed:', shipmentError);
                // Continue with the order process even if shipment creation fails
            }

            const orderItemsPromises = orderData.items.map(
                async (item: any) => {
                    const orderItemPayload = {
                        order: { id: orderResponseData.id },
                        product: { id: item.productId },
                        quantity: item.quantity,
                        price: item.price,
                    };

                    return fetch('http://localhost:8080/api/orderItems', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(orderItemPayload),
                    });
                },
            );

            await Promise.all(orderItemsPromises);

            await sendOrderNotificationToAdmin({
                ...orderPayload,
                orderId: orderResponseData.id,
                orderItems: orderData.items,
            });

            // Get cartId from localStorage or state
            const userData = JSON.parse(
                localStorage.getItem('userData') || '{}',
            );
            const cartResponse = await fetch(
                `http://localhost:8080/api/cart/user/${userData.id}`,
            );
            const cartData = await cartResponse.json();

            if (cartData && cartData.id) {
                await clearCart(cartData.id);
            }

            localStorage.removeItem('pendingOrder');
            notification.success({
                message: 'Order placed successfully',
                description: 'Your cart has been cleared',
            });

            router.push('/'); // Changed from '/order-success' to '/'
        } catch (error) {
            console.error('Error details:', error);
            notification.error({
                message: 'Lỗi đặt hàng',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại sau.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!orderData) {
        return <Spin />;
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow">
                        <h1 className="mb-6 text-2xl font-bold">Thanh toán</h1>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            {/* Add discount code section */}
                            <div className="mb-6">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Mã giảm giá
                                </h3>
                                <div className="flex gap-2">
                                    <Form.Item
                                        name="discountCode"
                                        className="flex-1"
                                    >
                                        <Input placeholder="Nhập mã giảm giá" />
                                    </Form.Item>
                                    <Button
                                        onClick={() =>
                                            handleApplyDiscount(
                                                form.getFieldValue(
                                                    'discountCode',
                                                ),
                                            )
                                        }
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>

                            <h3 className="mb-4 text-lg font-semibold">
                                Phương thức thanh toán
                            </h3>
                            <Form.Item
                                name="paymentMethod"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Vui lòng chọn phương thức thanh toán',
                                    },
                                ]}
                            >
                                <Radio.Group className="w-full">
                                    <div className="space-y-4">
                                        <Radio
                                            value="COD"
                                            className="w-full rounded-lg border p-4"
                                        >
                                            Thanh toán khi nhận hàng (COD)
                                        </Radio>
                                        <Radio
                                            value="CARD"
                                            className="w-full rounded-lg border p-4"
                                        >
                                            Thanh toán bằng thẻ
                                        </Radio>
                                    </div>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) =>
                                    prevValues.paymentMethod !==
                                    currentValues.paymentMethod
                                }
                            >
                                {({ getFieldValue }) =>
                                    getFieldValue('paymentMethod') ===
                                    'CARD' ? (
                                        <div className="space-y-4">
                                            <Form.Item
                                                name="cardNumber"
                                                label="Số thẻ"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Vui lòng nhập số thẻ',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="1234 5678 9012 3456" />
                                            </Form.Item>
                                            <Form.Item
                                                name="cardHolder"
                                                label="Tên chủ thẻ"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Vui lòng nhập tên chủ thẻ',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="NGUYEN VAN A" />
                                            </Form.Item>
                                        </div>
                                    ) : null
                                }
                            </Form.Item>

                            <div className="mt-6 border-t pt-6">
                                <div className="mb-2 flex justify-between">
                                    <span>Tổng tiền hàng:</span>
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(orderData.totalAmount)}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="mb-2 flex justify-between text-green-600">
                                        <span>Giảm giá:</span>
                                        <span className="font-semibold">
                                            -
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(discountAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className="mb-4 flex justify-between text-lg font-bold">
                                    <span>Tổng thanh toán:</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(
                                            orderData.totalAmount -
                                                discountAmount,
                                        )}
                                    </span>
                                </div>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="large"
                                >
                                    Hoàn tất đặt hàng
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;
