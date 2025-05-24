import { Button, Checkbox, Form, FormProps, Input, Typography } from 'antd';
import Link from 'next/link';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginForm = ({
    formInstace,
    onSubmit,
}: {
    formInstace: FormProps['form'];
    onSubmit: FormProps['onFinish'];
}) => {
    return (
        <Form
            name="login"
            layout="vertical"
            autoComplete="on"
            size="large"
            form={formInstace}
            onFinish={onSubmit}
            className="login-form"
        >
            <Form.Item>
                <Title level={2} className="text-center m-0">Đăng Nhập</Title>
                <p className="text-center text-gray-500 mt-2">Vui lòng đăng nhập để tiếp tục</p>
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                ]}
            >
                <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Email của bạn"
                    className="rounded-lg"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Mật khẩu"
                    className="rounded-lg"
                />
            </Form.Item>

            <Form.Item>
                <div className="flex justify-between items-center">
                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    <Link href="/forgot-password" className="text-primary">
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
                    className="rounded-lg h-12"
                >
                    Đăng Nhập
                </Button>
            </Form.Item>

            <Form.Item className="text-center">
                <p className="text-gray-500">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="text-primary font-medium">
                        Đăng ký ngay
                    </Link>
                </p>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
