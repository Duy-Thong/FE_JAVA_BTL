'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
    Divider,
    Descriptions,
    Button,
    message,
    Rate,
    Input,
    Form,
} from 'antd';
import { ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';

import OtherInfo from '@/components/ProductPage/OtherInfo';
import OtherProducts from '@/components/ProductPage/OtherProducts';

interface RatingSubmission {
    rating: number; // Changed from score to rating to match backend model
    comment: string;
    userId: string;
}

interface Rating {
    id: string;
    rating: number; // Changed from score to rating to match backend model
    comment: string;
    createdAt: string;
}

interface Product {
    id: string;
    retailer: string;
    img_url: string;
    name: string;
    price: number;
    url: string;
    category: string;
    averageRating: number;
    totalRatings: number;
}

const ProductPage = () => {
    const params = useParams();
    const router = useRouter();
    const [productData, setProductData] = useState<Product | null>(null);
    const [otherProducts, setOtherProducts] = useState<any>([]);
    const [fetchDone, setFetchDone] = useState<boolean>(false);
    const [cart, setCart] = useState<any[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (params) {
                    setIsLoading(true);
                    const productResponse = await axios.get(
                        `http://localhost:8080/api/product/${params.productId}`,
                    );
                    setProductData(productResponse.data);

                    if (productResponse.data.category) {
                        const categoryResponse = await axios.get(
                            `http://localhost:8080/api/product/category/${productResponse.data.category}`, // Fixed endpoint
                        );

                        // Filter out the current product and get 5 similar products
                        const filteredItems = categoryResponse.data
                            .filter((item) => item.id !== params.productId)
                            .slice(0, 5);
                            
                        setOtherProducts(filteredItems);
                    }

                    // Fetch ratings
                    const ratingsResponse = await axios.get(
                        `http://localhost:8080/api/ratings/product/${params.productId}`,
                    );
                    setRatings(ratingsResponse.data);

                    // Update average rating
                    const avgRatingResponse = await axios.get(
                        `http://localhost:8080/api/ratings/product/${params.productId}/average`,
                    );
                    // Update the productData with the new average rating
                    setProductData((prev) => ({
                        ...prev!,
                        averageRating: avgRatingResponse.data,
                        totalRatings: ratingsResponse.data.length,
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Không thể tải dữ liệu sản phẩm');
            } finally {
                setIsLoading(false);
                setFetchDone(true);
            }
        };

        fetchData();
    }, [params]);
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
    const addToCart = async (product) => {
        try {
            const userData = JSON.parse(
                localStorage.getItem('userData') || '{}',
            );
            
            // Check if user is logged in
            if (!userData.id) {
                message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                router.push('/login');
                return;
            }

            const userId = userData.id;
            const cartId = await getCartId(userId);
            const response = await axios.post(
                `http://localhost:8080/api/cartitems/add/${cartId}`,
                {
                    product: {
                        id: product.id,
                        retailer: product.retailer,
                        img_url: product.img_url,
                        name: product.name,
                        price: product.price,
                        url: product.url,
                        category: product.category,
                    },
                    quantity: 1,
                },
            );

            if (response.data) {
                setCart([...cart, product]);
                message.success('Đã thêm sản phẩm vào giỏ hàng');
            }
        } catch (error: any) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            message.error(
                error.response?.data?.message ||
                    'Lỗi khi thêm sản phẩm vào giỏ hàng',
            );
        }
    };

    const handleRatingSubmit = async (values: {
        rating: number;
        comment: string;
    }) => {
        try {
            // Hardcoded userId for testing - replace with actual user authentication
            const userData = JSON.parse(
                localStorage.getItem('userData') || '{}',
            );
            const userId = userData.id;

            const ratingSubmission: RatingSubmission = {
                rating: values.rating, // Changed from score to rating
                comment: values.comment || '',
                userId: userId,
            };

            const response = await axios.post(
                `http://localhost:8080/api/ratings/product/${params.productId}`,
                ratingSubmission,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.data) {
                message.success('Đánh giá của bạn đã được ghi nhận');
                form.resetFields();

                // Refresh ratings
                const ratingsRes = await axios.get(
                    `http://localhost:8080/api/ratings/product/${params.productId}`,
                );
                setRatings(ratingsRes.data);

                // Refresh product data
                const productRes = await axios.get(
                    `http://localhost:8080/api/product/${params.productId}`,
                );
                setProductData(productRes.data);
            }
        } catch (error: any) {
            console.error(
                'Error submitting rating:',
                error.response?.data || error,
            );

            // More specific error messages based on error type
            if (error.response?.status === 401) {
                message.error('Vui lòng đăng nhập để đánh giá sản phẩm');
            } else if (error.response?.status === 400) {
                message.error('Thông tin đánh giá không hợp lệ');
            } else {
                message.error('Không thể gửi đánh giá. Vui lòng thử lại sau.');
            }
        }
    };

    const productItems = [
        {
            key: 'name',
            children: (
                <h1 className="mb-2 text-2xl font-bold text-gray-800">
                    {productData?.name}
                </h1>
            ),
            span: 3,
        },
        {
            key: 'rating',
            children: productData && (
                <div className="mb-4 flex items-center gap-2">
                    <Rate
                        disabled
                        value={productData.averageRating}
                        className="text-yellow-400"
                    />
                    <span className="text-gray-600">
                        ({productData.totalRatings} đánh giá)
                    </span>
                </div>
            ),
            span: 3,
        },
        {
            key: 'price',
            children: productData?.price ? (
                <div className="mb-4">
                    <div className="text-3xl font-bold text-red-600">
                        {productData.price.toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="text-lg text-gray-500 line-through">
                        {(productData.price * 1.1).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="text-sm text-green-600">
                        Tiết kiệm {(productData.price * 0.1).toLocaleString('vi-VN')} ₫
                    </div>
                </div>
            ) : (
                ''
            ),
            span: 3,
        },
        {
            key: 'promotions',
            children: (
                <div className="mb-4">
                    <h3 className="font-semibold text-red-600 mb-2">Khuyến mãi đặc biệt</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="inline-block w-5 h-5 bg-red-600 text-white rounded-full text-center text-sm">1</span>
                            <span>Giảm ngay 10% cho khách hàng mua online</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="inline-block w-5 h-5 bg-red-600 text-white rounded-full text-center text-sm">2</span>
                            <span>Tặng phiếu mua hàng trị giá 500.000đ</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="inline-block w-5 h-5 bg-red-600 text-white rounded-full text-center text-sm">3</span>
                            <span>Miễn phí giao hàng toàn quốc</span>
                        </li>
                    </ul>
                </div>
            ),
            span: 3,
        }
    ];

    return (
        <div className="container mx-auto bg-gray-100 p-8">
            <div className="grid grid-cols-1 gap-8 rounded-xl bg-white p-8 shadow-lg border-2 border-gray-200 lg:grid-cols-2">
                {/* Product Image Section */}
                <div className="relative h-[500px] overflow-hidden rounded-xl border-2 border-gray-100 p-4 bg-white shadow-sm">
                    <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Giảm 10%
                    </div>
                    <Image
                        src={productData?.img_url || ''}
                        alt="Hình ảnh sản phẩm"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Product Info Section */}
                <div className="flex flex-col divide-y divide-gray-200">
                    <Descriptions
                        bordered={false}
                        column={1}
                        items={productItems}
                        className="product-descriptions"
                    />

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-4">
                        <Button
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
                            onClick={() => addToCart(productData)}
                        >
                            <ShoppingCartOutlined />
                            Thêm vào giỏ hàng
                        </Button>
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                            <span className="text-2xl">📞</span>
                            <span>Gọi đặt mua: 1800.1060 (7:30 - 22:00)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Section */}
            <div className="mt-8 rounded-xl bg-white p-8 shadow-lg border-2 border-gray-200">
                <h2 className="mb-6 text-2xl font-bold border-b-2 border-gray-200 pb-4">Đánh giá sản phẩm</h2>

                {/* Rating Form */}
                <div className="mb-8 rounded-lg bg-gray-50 p-6 border border-gray-200">
                    <Form
                        form={form}
                        onFinish={handleRatingSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="rating"
                            label={
                                <span className="font-semibold">
                                    Đánh giá của bạn
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn số sao',
                                },
                            ]}
                        >
                            <Rate className="text-yellow-400" />
                        </Form.Item>
                        <Form.Item
                            name="comment"
                            label={
                                <span className="font-semibold">Nhận xét</span>
                            }
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                className="rounded-lg"
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="h-10 rounded-lg bg-blue-600 px-6 hover:bg-blue-700"
                        >
                            Gửi đánh giá
                        </Button>
                    </Form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6 divide-y divide-gray-200">
                    {ratings.map((rating, index) => (
                        <div
                            key={rating.id || index}
                            className="pt-6 first:pt-0"
                        >
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <Rate
                                    disabled
                                    value={rating.rating}
                                    className="text-yellow-400"
                                />
                                <p className="mt-3 text-gray-700">
                                    {rating.comment}
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    {new Date(rating.createdAt).toLocaleDateString(
                                        'vi-VN',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        },
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* <OtherInfo /> */}

            {/* Related Products */}
            {!isLoading && otherProducts.length > 0 && (
                <div className="mt-8 rounded-xl bg-white p-8 shadow-lg border-2 border-gray-200">
                    <h2 className="mb-6 text-2xl font-bold border-b-2 border-gray-200 pb-4">
                        Sản phẩm tương tự
                    </h2>
                    <OtherProducts data={otherProducts} />
                </div>
            )}
            {!isLoading && otherProducts.length === 0 && (
                <div className="mt-8 text-center text-gray-500">
                    Không có sản phẩm tương tự
                </div>
            )}
            </div>
    );
};

export default ProductPage;
