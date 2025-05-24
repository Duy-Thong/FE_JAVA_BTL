'use client';
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { 
    ShoppingCartOutlined, 
    StarOutlined, 
    UserOutlined, 
    DollarOutlined 
} from '@ant-design/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const { Title: TitleAnt } = Typography;

const AdminStatistics = () => {
    const [statistics, setStatistics] = useState({
        totalOrders: 0,
        averageRating: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        monthlyOrders: [],
        productRatings: []
    });

    useEffect(() => {
        // Fetch statistics from your API
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/statistics');
                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    const monthlyOrdersData = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
        datasets: [
            {
                label: 'Đơn hàng theo tháng',
                data: statistics.monthlyOrders,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderRadius: 8,
            },
        ],
    };

    const ratingData = {
        labels: ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'],
        datasets: [
            {
                label: 'Đánh giá sản phẩm',
                data: statistics.productRatings,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <TitleAnt level={2} className="mb-8 text-gray-800">
                Thống kê tổng quan
            </TitleAnt>
            
            <Row gutter={[24, 24]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-600">Tổng đơn hàng</span>}
                            value={statistics.totalOrders}
                            prefix={<ShoppingCartOutlined className="text-blue-500" />}
                            className="text-center"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-600">Đánh giá trung bình</span>}
                            value={statistics.averageRating}
                            precision={1}
                            prefix={<StarOutlined className="text-yellow-500" />}
                            suffix="/5"
                            className="text-center"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-600">Doanh thu</span>}
                            value={statistics.totalRevenue}
                            prefix={<DollarOutlined className="text-green-500" />}
                            suffix="VNĐ"
                            className="text-center"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-600">Tổng khách hàng</span>}
                            value={statistics.totalCustomers}
                            prefix={<UserOutlined className="text-purple-500" />}
                            className="text-center"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card hoverable className="shadow-sm hover:shadow-md transition-shadow">
                        <TitleAnt level={4} className="mb-6 text-gray-700">
                            Đơn hàng theo tháng
                        </TitleAnt>
                        <div className="p-4">
                            <Bar 
                                data={monthlyOrdersData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card hoverable className="shadow-sm hover:shadow-md transition-shadow">
                        <TitleAnt level={4} className="mb-6 text-gray-700">
                            Phân bố đánh giá
                        </TitleAnt>
                        <div className="p-4">
                            <Line 
                                data={ratingData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminStatistics;