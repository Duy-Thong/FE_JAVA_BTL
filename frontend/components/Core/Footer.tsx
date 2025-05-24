import React from 'react';
import { Layout, Typography, Row, Col } from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import branch1 from "../../app/assets/images/branch1.png"
import ghn from "../../app/assets/images/ghn.png"
import ghtk from "../../app/assets/images/ghtk.png"
import ems from "../../app/assets/images/ems.png"
import jandt from "../../app/assets/images/jandt.png"

const { Text } = Typography;
const { Footer } = Layout;

const FooterView = () => {
    return (
        <Footer className="bg-white py-8">
            <Row gutter={[32, 32]} justify="space-around" className="max-w-7xl mx-auto px-4">
                {/* Company Info Column */}
                <Col xs={24} md={6} className="mb-6 md:mb-0">
                    <div className="flex flex-col">
                        <Image
                            src={branch1}
                            alt="PTIT Store"
                            className="w-48 h-20 object-contain mb-6"
                        />
                        <div className="flex flex-col space-y-4">
                            <Text className="flex items-center font-medium text-gray-600">
                                <EnvironmentOutlined className="mr-2 text-blue-500" />
                                Km 10, Đường Nguyễn Trãi, Hà Nội – Hà Đông
                            </Text>
                            <Text className="flex items-center font-medium text-gray-600">
                                <PhoneOutlined className="mr-2 text-blue-500" />
                                0397403808
                            </Text>
                            <Text className="flex items-center font-medium text-gray-600">
                                <MailOutlined className="mr-2 text-blue-500" />
                                ptitstore@gmail.com
                            </Text>
                        </div>
                    </div>
                </Col>

                {/* Links Column */}
                <Col xs={24} md={6} className="mb-6 md:mb-0">
                    <div className="flex flex-col space-y-8">
                        <div>
                            <Text className="text-blue-500 font-bold text-lg block mb-4">
                                Thông tin chung
                            </Text>
                            <Text className="font-medium text-gray-600 block">
                                Giới thiệu
                            </Text>
                        </div>
                        
                        <div>
                            <Text className="text-blue-500 font-bold text-lg block mb-4">
                                Hướng dẫn mua bán
                            </Text>
                            <div className="flex flex-col space-y-2">
                                <Text className="font-medium text-gray-600">
                                    Chính Sách Vận Chuyển - Giao Hàng
                                </Text>
                                <Text className="font-medium text-gray-600">
                                    Chính Sách Bảo Hành Đổi Trả
                                </Text>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Payment & Shipping Column */}
                <Col xs={24} md={8} className="mb-6 md:mb-0">
                    <div className="flex flex-col space-y-8">
                        <div>
                            <Text className="text-blue-500 font-bold text-lg block mb-4">
                                Hình thức thanh toán
                            </Text>
                            <div className="flex flex-col space-y-2">
                                <Text className="font-medium text-gray-600">Chuyển khoản</Text>
                                <Text className="font-medium text-gray-600">Tiền mặt</Text>
                            </div>
                        </div>

                        <div>
                            <Text className="text-blue-500 font-bold text-lg block mb-4">
                                Đơn Vị Vận Chuyển
                            </Text>
                            <div className="flex flex-row items-center gap-6">
                                {[ghn, ghtk, ems, jandt].map((logo, index) => (
                                    <div key={index} className="w-20 h-12 flex items-center justify-center">
                                        <Image
                                            src={logo}
                                            alt="Shipping Partner"
                                            width={75}
                                            height={45}
                                            className="object-contain rounded hover:opacity-80 transition-opacity"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Footer>
    );
};

export default FooterView;
