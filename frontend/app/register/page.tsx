'use client';

import React from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/lib/http/axios-instance';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [formInstance] = Form.useForm();

    const registerSubmitHandler = async (values: Record<string, any>) => {
        try {
            await axiosInstance.post('/auth/register', {
                email: values.email,
                password: values.password,
                name: values.name
            });

            formInstance.resetFields();
            message.success('Đăng ký thành công');
            router.push('/login');
        } catch (error: any) {
            console.error('Registration error:', error);
            message.error('Đăng ký thất bại. Vui lòng thử lại');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="mx-4 grid w-full max-w-5xl gap-8 md:grid-cols-2">
                {/* Left side - Illustration */}
                <div className="hidden flex-col items-center justify-center text-white md:flex">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/006/912/004/non_2x/secure-login-and-sign-up-concept-illustration-vector.jpg"
                        alt="Register"
                        className="animate-float h-96 w-96 object-contain"
                    />
                    <h2 className="mt-6 text-3xl font-bold">
                        Tạo tài khoản mới!
                    </h2>
                    <p className="mt-2 text-center text-lg">
                        Đăng ký để trải nghiệm dịch vụ của chúng tôi
                    </p>
                </div>

                {/* Right side - Registration Form */}
                <div className="transform rounded-xl bg-white p-8 shadow-2xl transition-transform duration-300 hover:scale-105">
                    <Form
                        name="register"
                        layout="vertical"
                        autoComplete="off"
                        size="large"
                        form={formInstance}
                        onFinish={registerSubmitHandler}
                        className="space-y-4"
                    >
                        <Form.Item className="text-center">
                            <Title level={2} className="m-0">
                                Đăng Ký
                            </Title>
                            <p className="mt-2 text-gray-500">
                                Tạo tài khoản mới để bắt đầu
                            </p>
                        </Form.Item>

                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Họ và tên"
                                className="rounded-lg"
                            />
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
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="Email"
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
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Mật khẩu"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng xác nhận mật khẩu',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Xác nhận mật khẩu"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                            >
                                Đăng Ký
                            </Button>
                        </Form.Item>

                        <Form.Item className="text-center">
                            <p className="text-gray-500">
                                Đã có tài khoản?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-blue-500 hover:text-blue-600"
                                >
                                    Đăng nhập
                                </Link>
                            </p>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
