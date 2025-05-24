'use client';
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string }) => {
        setLoading(true);
        try {
            // Handle forgot password logic here
            message.success('If an account exists with that email, you will receive a password reset link shortly.');
        } catch (error) {
            message.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </div>
                <Form
                    name="forgot-password"
                    className="mt-8 space-y-6"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                            {
                                type: 'email',
                                message: 'Please enter a valid email address!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Email address"
                            size="large"
                            className="rounded-md"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            size="large"
                            loading={loading}
                        >
                            Send Reset Link
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPassword;
