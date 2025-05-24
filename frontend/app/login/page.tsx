'use client';

import React from 'react';
import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/http/axios-instance';
import { useAuth } from '@/hooks/useAuth';
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;

interface UserData {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdDate: string;
    lastModifiedDate: string;
}

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [formInstance] = Form.useForm();
    const { mutate } = useAuth();

    const loginSubmitHandler = async (values: Record<string, any>) => {
        try {
            const response = await axiosInstance.post('/auth/login', values);

            if (!response) {
                throw new Error('Token not found');
            }

            localStorage.setItem('token', response);

            const decodedToken: any = jwtDecode(response);
            const userEmail = decodedToken.sub;
            const userResponse = await axiosInstance.get<UserData>(
                `/client/users/email/${userEmail}`,
            );
            
            localStorage.setItem('userData', JSON.stringify(userResponse));
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            formInstance.resetFields();
            mutate(null);
            router.push('/');
            message.success('Đăng nhập thành công');
        } catch (error: any) {
            console.error('Login error:', error);
            message.error('Email hoặc mật khẩu không chính xác');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="mx-4 grid w-full max-w-5xl gap-8 md:grid-cols-2">
                {/* Left side - Illustration */}
                <div className="hidden flex-col items-center justify-center text-white md:flex">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/006/912/004/non_2x/secure-login-and-sign-up-concept-illustration-vector.jpg"
                        alt="Login"
                        className="animate-float h-96 w-96 object-contain"
                    />
                    <h2 className="mt-6 text-3xl font-bold">
                        Chào mừng trở lại!
                    </h2>
                    <p className="mt-2 text-center text-lg">
                        Đăng nhập để trải nghiệm dịch vụ của chúng tôi
                    </p>
                </div>

                {/* Right side - Login Form */}
                <div className="transform rounded-xl bg-white p-8 shadow-2xl transition-transform duration-300">
                   

                    <Form
                        name="login"
                        layout="vertical"
                        autoComplete="on"
                        size="large"
                        form={formInstance}
                        onFinish={loginSubmitHandler}
                        className="space-y-4"
                    >
                        <Form.Item className="text-center">
                            <Title level={2} className="m-0">
                                Đăng Nhập
                            </Title>
                            <p className="mt-2 text-gray-500">
                                Vui lòng đăng nhập để tiếp tục
                            </p>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ',
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Email của bạn"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Mật khẩu"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item>
                            <div className="flex items-center justify-between">
                                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                <Link
                                    href="/forgot-password"
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                icon={<LoginOutlined />}
                                className="h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>

                        <Form.Item className="text-center">
                            <p className="text-gray-500">
                                Chưa có tài khoản?{' '}
                                <span
                                    onClick={() => router.push('/register')}
                                    className="cursor-pointer font-medium text-blue-500 hover:text-blue-600"
                                >
                                    Đăng ký ngay
                                </span>
                            </p>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
