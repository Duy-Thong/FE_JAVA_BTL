'use client';
import React from 'react';
import { Form, Input, Button, Card, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const AccountSettingsPage: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const onFinish = (values: any) => {
        console.log('Form values:', values);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <Card className="max-w-2xl mx-auto relative">
                <Button 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                    className="absolute left-6 top-6"
                >
                    Trở về
                </Button>

                <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center mt-8">
                    Cài Đặt Tài Khoản
                </h1>
                
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="w-full"
                >
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Tên đăng nhập"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            size="large"
                            className="w-full md:w-auto"
                        >
                            Lưu Thay Đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AccountSettingsPage;